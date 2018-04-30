const { makeExecutableSchema } = require("graphql-tools");

import { PubSub, withFilter } from "graphql-subscriptions";
import users from "./mocks/users";
import channels from "./mocks/faker";

// The GraphQL schema in string form
const typeDefs = `
  type User {
    id: String!,

    """The readable name"""
    name: String!

    channels: [Channel!]!
  }

  type Channel {
    """Unique identifier"""
    id: String!

    """Human-readable title of this Channel"""
    title: String!
    members: [User!]!
    messages: [Message!]!

    """The newest message that have been posted to this channel"""
    latestMessage: Message!
  }

  type Message {
    id: String!
    author: User!
    date: String!
    text: String!
    channel: Channel!
  }


  type Query { 
    channels(memberId: String): [Channel!]! 
    user(userId: String!): User
    users: [User!]! 
    channel(channelId: String!): Channel
  }

  type Mutation {
    postMessage(channelId: String!, authorId: String!, message: String!): Message!
  }

  type Subscription {
    messageAdded(channelIds: [String!]!): Message!
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
    users: () => users,
    user: (obj: any, args: { userId: string }) => users.find(u => u.id === args.userId)
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

      pubsub.publish("messageAdded", {
        messageAdded: newMessage,
        channel: channel
      });

      return newMessage;
    }
  },
  Subscription: {
    messageAdded: {
      resolve: (payload: any) => {
        const value = payload.messageAdded;
        console.log("PAYLOAD", payload);
        console.log("VALUE", value);
        return value;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator("messageAdded"),
        ({ channel }: { channel: any }, { channelIds }: { channelIds: string[] }) => {
          return channelIds.includes(channel.id);
        }
      )
    }
  },
  User: {
    channels: (obj: User) => channels.filter(c => c.members.find(m => m.id === obj.id) !== undefined)
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
  },
  Message: {
    channel: (obj: Message) => channels.find(c => c.messages.find(m => m.id === obj.id) !== undefined)
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;

// const GENERATE_DUMMY_MESSAGES = false;

// GENERATE_DUMMY_MESSAGES &&
//   setInterval(() => {
//     const newMessageId = messageIdCounter++;
//     const channel = newMessageId % 2 ? channels[0] : channels[1];
//     console.log(`PUBLISH NEW MESSAGE ${newMessageId} to channel ${channel.id} (${channel.title})`);
//     const newMessage: Message = {
//       id: `am-${newMessageId}`,
//       text: `Auto Message ${newMessageId} in ${channel.title}`,
//       date: new Date().toISOString(),
//       author: users[Math.floor(Math.random() * users.length)]
//     };
//     channel.messages = channel.messages.concat(newMessage);
//     pubsub.publish("messageAdded", {
//       messageAdded: newMessage,
//       channel: channel
//     });
//   }, 2000);
