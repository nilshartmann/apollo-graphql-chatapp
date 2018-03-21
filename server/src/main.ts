const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
import { createServer } from "http";
import { execute, subscribe } from "graphql";
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
import { SubscriptionServer } from "subscriptions-transport-ws";

import { PubSub } from "graphql-subscriptions";
import users from "./mocks/users";
import channels from "./mocks/channels";

// The GraphQL schema in string form
const typeDefs = `
  type User {
    id: String!,

    """The readable name"""
    name: String!
  }

  type Channel {
    id: String!

    title: String!
    members: [User!]!
    messages: [Message!]!

    latestMessage: Message!
  }

  type Message {
    id: String!
    author: User!
    date: String!
    text: String!
  }

  type Query { 
    channels(memberId: String): [Channel!]! 
    users: [User!]! 
    channel(channelId: String!): Channel
  }

  type Mutation {
    postMessage(channelId: String!, authorId: String!, message: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;

interface User {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  title: string;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  date: string;
  author: User;
}
let messageIdCounter = 10000;
const pubsub = new PubSub();
// The resolvers
const resolvers = {
  Query: {
    channels: (_: any, args: { memberId?: string }) =>
      args.memberId ? channels.filter(c => c.members.find(m => m.id === args.memberId) !== undefined) : channels,
    channel: (obj: any, args: { channelId: string }) => channels.find(c => c.id === args.channelId),
    users: () => users
  },
  Mutation: {
    postMessage: (_: any, args: { channelId: string; authorId: string; message: string }) => {
      const author = users.find(user => user.id === args.authorId);
      if (!author) {
        throw new Error(`Author with id ${args.authorId} not found`);
      }
      const channel = channels.find(c => c.id === args.channelId);
      if (!channel) {
        throw new Error(`Channel with id ${args.authorId} not found`);
      }

      const newMessage: Message = {
        id: `m${messageIdCounter++}`,
        text: args.message,
        date: new Date().toISOString(),
        author
      };

      console.log("New Message", newMessage);

      channel.messages = channel.messages.concat(newMessage);
      return newMessage;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator("messageAdded")
    }
  },
  Channel: {
    latestMessage: (obj: Channel) =>
      obj.messages.reduce((prev: Message, curr: Message) => {
        const d1 = new Date(prev.date).getTime();
        const d2 = new Date(curr.date).getTime();
        if (d2 > d1) {
          return curr;
        }
        return prev;
      })
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

app.use(cors());

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

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

// setInterval(() => {
//   const newMessageId = `automessage-${messageIdCounter++}`;
//   console.log("PUBLISH NEW MESSAGE..." + newMessageId);
//   const newMessage: Message = {
//     id: newMessageId,
//     text: `Auto Message ${newMessageId}`,
//     date: new Date().toISOString(),
//     author: users[Math.floor(Math.random() * users.length)]
//   };
//   pubsub.publish("messageAdded", {
//     messageAdded: newMessage
//   });
// }, 2000);
