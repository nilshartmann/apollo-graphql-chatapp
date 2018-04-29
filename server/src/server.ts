import express from "express";

const bodyParser = require("body-parser");
const cors = require("cors");
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";

import { createServer } from "http";
import { execute, subscribe } from "graphql";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { PubSub, withFilter } from "graphql-subscriptions";

import schema from "./api";

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
    JWT_SECRET
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
  graphqlExpress(
    req =>
      console.log(req && req.user) || {
        schema
      }
  )
);

// GraphiQL, a visual editor for queries
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://localhost:3000/subscriptions`
  })
);

// Start the server
const ws = createServer(app).listen(3000, () => {
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );

  console.log(`GraphQL Server is now running on http://localhost:3000`);
});
