import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ApolloClient, { gql } from "./boost_patch/ApolloClientWithWebsockets";
import { ApolloProvider } from "react-apollo";
import App from "./App";
import { ApolloCache } from "apollo-cache";

import * as Resolvers from "./resolvers";
import { setLocalUserId, getJwtToken } from "./authService";

// setLocalAuthId("u3");

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: async operation => {
    const token = getJwtToken();
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }
  },
  clientState: {
    defaults: Resolvers.defaults,
    resolvers: Resolvers.resolvers
  }
});

const chatApp = (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

const mountNode = document.getElementById("chat-app");

ReactDOM.render(chatApp, mountNode);
