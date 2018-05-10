const { makeExecutableSchema } = require("graphql-tools");

import { PubSub, withFilter } from "graphql-subscriptions";
import users from "./mocks/users";
import channels from "./mocks/faker";

export interface ResolverContext {
  currentUserId?: string;
}

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

    """
    The Owner of this Channel.
    Only Owners can administer a Channel and add and remove users from it
    """
    owner: User!

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

  type PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
	}

  type SearchMessagesResultEdge {
    cursor: String!
    node: Message!
  }

  type SearchMessagesResultConnection {
    edges: [SearchMessagesResultEdge!]!
    pageInfo: PageInfo!
  }


  type Query { 
    """All Channels that contain the specified Member"""
    channels(memberId: String): [Channel!]! 

    """Return the currently logged in user if logged in"""
    me: User

    """The User with the specified id"""
    user(userId: String!): User

    """All Users"""
    users: [User!]! 

    """The Channel with the given id"""
    channel(channelId: String!): Channel

    # https://facebook.github.io/relay/graphql/connections.htm
    """Searches for messsages that contain the specified search string
    
    All channels **the current user belongs to** are searched.
    If there is no logged in user, nothing will be searched.
    
    """
    searchMessages(searchString: String!, first: Int = 10, after: String): SearchMessagesResultConnection!
  }

  type Mutation {
    postMessage(channelId: String!, authorId: String!, message: String!): Message!
    createChannel(title: String!, firstMessage: String!, initalMemberIds: [String!]!): Channel!
    addMembersToChannel(channelId: String!, memberIds: [String!]!): Channel!
  }

  type Subscription {
    messageAdded(channelIds: [String!]!): Message!
    addedToChannel: Channel!
  }
`;

interface User {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  title: string;
  owner: User;
  members: User[];
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  date: string;
  author: User;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface SearchMessagesResultEdge {
  cursor: string;
  node: Message;
}

interface SearchMessagesResultConnection {
  edges: SearchMessagesResultEdge[];
  pageInfo: PageInfo;
}

function userIdFromRequest(context: ResolverContext) {
  const theUserId = context.currentUserId;
  if (!theUserId) {
    throw new Error("Missing user id in request (not authenticated?)");
  }

  // if (userId && userId !== theUserId) {
  //   throw new Error(`User-Id '${theUserId}' from request is not allowed to access this resource from user '${userId}'`);
  // }

  return theUserId;
}

let messageIdCounter = 10000;
// note that the eventemitter is not for production use
// (see: https://github.com/apollographql/graphql-subscriptions#getting-started-with-your-first-subscription)
// we may get Possible EventEmitter memory leak detected messages
// we could switch to postgres-based ee: https://github.com/GraphQLCollege/graphql-postgres-subscriptions
const pubsub = new PubSub();
// The resolvers
const resolvers = {
  Query: {
    channels: (_: any, args: { memberId?: string }) =>
      args.memberId ? channels.filter(c => c.members.find(m => m.id === args.memberId) !== undefined) : channels,
    channel: (obj: any, args: { channelId: string }) => channels.find(c => c.id === args.channelId),
    users: () => users,
    user: (obj: any, args: { userId: string }) => users.find(u => u.id === args.userId),
    me: (_: any, args: any, context: ResolverContext) => {
      const theUserId = context.currentUserId;

      if (!theUserId) {
        return;
      }

      const user = users.find(u => u.id === theUserId);
      if (user) {
        return user;
      }

      throw new Error(`User with id '${theUserId}' not found`);
    },
    searchMessages: (
      _: any,
      args: { searchString: string; first: number; after?: string },
      context: ResolverContext
    ): SearchMessagesResultConnection => {
      const theUserId = userIdFromRequest(context);
      const messagesFound: Message[] = [];

      channels
        // search only channels, the user is member of
        .filter(c => c.members.find(m => m.id === theUserId) !== undefined)
        // search in each channel
        .forEach(c => c.messages.forEach(m => m.text.indexOf(args.searchString) !== -1 && messagesFound.push(m)));

      // sort messages (newest first)
      messagesFound.sort((m1, m2) => {
        const r = new Date(m2.date).getTime() - new Date(m1.date).getTime();
        if (r === 0) {
          return m2.id.localeCompare(m1.id);
        }
        return r;
      });

      let firstIx = 0;
      if (args.after) {
        firstIx = messagesFound.findIndex(m => m.id === args.after);
        if (firstIx !== -1) {
          firstIx++;
        }
      }

      if (firstIx < 0) {
        return {
          edges: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false
          }
        };
      }

      const edges: SearchMessagesResultEdge[] = messagesFound
        // limit number of results according to parameters
        .slice(firstIx, firstIx + args.first)
        // transform to Edges
        .map(message => ({
          node: message,
          cursor: message.id
        }));

      return {
        edges,
        pageInfo: {
          hasPreviousPage: firstIx > 0,
          hasNextPage: firstIx + args.first < messagesFound.length
        }
      };
    }
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
    },
    // createChannel(title: String!, firstMessage: String!, initialMembers: [String!]!): Channel!
    createChannel: (
      _: any,
      args: { title: string; firstMessage: string; initalMemberIds: string[] },
      context: ResolverContext
    ) => {
      const currentUserId = userIdFromRequest(context);

      const getUserById = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
          return user;
        }

        throw new Error(`User with id '${id}' not found`);
      };

      const owner = getUserById(currentUserId);

      const newMessage: Message = {
        id: `m${messageIdCounter++}`,
        text: args.firstMessage,
        date: new Date().toISOString(),
        author: owner
      };

      const newChannel: Channel = {
        id: `c${channels.length + 1}`,
        owner,
        title: args.title,
        messages: [newMessage],
        members: args.initalMemberIds.map(im => getUserById(im))
      };

      channels.push(newChannel);

      pubsub.publish("addedToChannel", {
        channel: newChannel,
        newMemberIds: newChannel.members.map(m => m.id)
      });

      return newChannel;
    },
    addMembersToChannel: (_: any, args: { channelId: string; memberIds: string[] }, context: ResolverContext) => {
      const currentUserId = userIdFromRequest(context);

      const theChannel = channels.find(c => c.id === args.channelId);
      if (!theChannel) {
        throw new Error(`Channel with id '${args.channelId} not found`);
      }
      if (currentUserId !== "u6" && theChannel.owner.id !== currentUserId) {
        throw new Error(
          `Current user '${currentUserId} not owner of channel '${theChannel.id}' (owner is: '${theChannel.owner.id})`
        );
      }

      const newMembers: User[] = [];

      args.memberIds.forEach(mId => {
        const user = users.find(u => u.id === mId);
        if (!user) {
          console.log(`User-Id '${mId}' not found`);
          // ignore unknown users. caller of this mutation
          // "sees" this when looking into the returned new
          // Channel object
          return;
        }

        const isNewMember =
          theChannel.members.findIndex(nm => nm.id === mId) === -1 && newMembers.findIndex(nm => nm.id === mId) === -1;
        if (isNewMember) {
          console.log("new member in channel:" + user.id);
          newMembers.push(user);
        }
      });

      theChannel.members = [...theChannel.members, ...newMembers];

      console.log("newMembers: ", newMembers.map(m => m.id));

      pubsub.publish("addedToChannel", {
        channel: theChannel,
        newMemberIds: newMembers.map(m => m.id)
      });

      return theChannel;
    }
  },
  Subscription: {
    messageAdded: {
      resolve: (payload: any) => {
        const value = payload.messageAdded;
        return value;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator("messageAdded"),
        ({ channel }: { channel: any }, { channelIds }: { channelIds: string[] }) => {
          console.log("subscribe", channelIds);
          return channelIds.includes(channel.id);
        }
      )
    },
    addedToChannel: {
      resolve: (payload: any) => {
        const { channel, newMemberIds } = payload;
        return channel;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator("addedToChannel"),
        (rootValue: any, args: any, context: ResolverContext) => {
          console.log("### rootValue", rootValue);
          console.log("### context", context);

          const { currentUserId } = context;
          const newMemberIds: String[] = rootValue.newMemberIds;
          console.log("### rootValue.newMembersIds", rootValue.newMemberIds);
          if (!currentUserId) {
            return false;
          }
          return newMemberIds.includes(currentUserId);
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
