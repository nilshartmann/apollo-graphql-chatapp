import express from "express";

const bodyParser = require("body-parser");
const cors = require("cors");
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";

import { createServer } from "http";
import { execute, subscribe } from "graphql";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { SubscriptionServer, ConnectionContext } from "subscriptions-transport-ws";
import { PubSub, withFilter } from "graphql-subscriptions";
import { checkTokenFromHeader } from "./jwtutil";
import schema, { ResolverContext } from "./api";

// hmmm... 😱
import users from "./mocks/users";

// even more hmmm... 😱😱😱😱😱
const JWT_SECRET = "FeineSahneFischfilet";

// Initialize the app
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password }: { username?: string; password?: string } = req.body;

  console.log(`Authenticating '${username}' with a password...`);

  if (!username || !password) {
    return res.status(401).send({ error: "Specify username and password!" });
  }

  const user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
  if (!user || !password) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const token = jsonwebtoken.sign(
    {
      userId: user.id
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  return res.status(200).send({
    token,
    userId: user.id
  });
});

// The GraphQL endpoint
app.use(
  "/graphql",
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false
  }),
  graphqlExpress(req => {
    console.log("User from token", req && req.user);
    const currentUserId = req && req.user && req.user.userId;

    return {
      schema,
      context: {
        currentUserId
      } as ResolverContext
    };
  })
);

// Add GraphiQL, a visual editor for queries

// User "u6" is always used when making request from graphiql
// not a good solution for real/production live but for
// development purposes sufficent
const theTokenForGraphiQLThatNeverExpires = jsonwebtoken.sign(
  {
    userId: "u6"
  },
  JWT_SECRET,
  { expiresIn: "1y" }
);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://localhost:3000/subscriptions`,
    passHeader: `'authorization': 'Bearer ${theTokenForGraphiQLThatNeverExpires}'`
  })
);

let CONNECTION_COUNT = 0;

// Start the server
const ws = createServer(app).listen(3000, () => {
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: (connectionParams: any, websocket: any, context: ConnectionContext) => {
        // https://github.com/apollographql/subscriptions-transport-ws/blob/master/docs/source/authentication.md
        const counter = ++CONNECTION_COUNT;
        console.log("onConnect #" + counter, connectionParams);

        const token = checkTokenFromHeader(connectionParams.authorization, { secret: JWT_SECRET });

        const resContext: ResolverContext = {
          currentUserId: token.userId
        };

        return resContext;
      },
      onDisconnect: (webSocket: any, context: any) => {
        console.log("onDisconnect", context);
      }
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );

  console.log(`GraphQL Server is now running on http://localhost:3000`);
});
