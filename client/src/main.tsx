import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "./app";

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  clientState: {
    defaults: {
      currentChannel: {
        __typename: "CurrentChannel",
        currentChannelId: "c1"
      }
    },
    resolvers: {
      Mutation: {
        setCurrentChannel: (_: any, { currentChannelId }: { currentChannelId: string }, { cache }: any) => {
          cache.writeData({ data: { currentChannel: { currentChannelId } } });
          return null;
        }
      }
    }
  }
});

const chatApp = (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

const mountNode = document.getElementById("chat-app");

ReactDOM.render(chatApp, mountNode);
