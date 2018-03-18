import * as React from "react";
import * as ReactDOM from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "./app";

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({ uri: "http://localhost:3000/graphql" });

const chatApp = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

const mountNode = document.getElementById("chat-app");

ReactDOM.render(chatApp, mountNode);
