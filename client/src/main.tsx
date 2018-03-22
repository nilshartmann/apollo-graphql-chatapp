import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ApolloClient from "./boost_patch/ApolloClientWithWebsockets";
import { ApolloProvider } from "react-apollo";
import App from "./app";
import { ApolloCache } from "apollo-cache";

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  clientState: {
    defaults: {
      currentUser: {
        __typename: "CurrentUser",
        id: "u5",
        name: "Maja"
      }
    },
    resolvers: []
  }
  //   resolvers: {
  //     Query: {
  //       draftMessage: (_: any, { channelId }: { channelId: string }, { cache }: { cache: ApolloCache<any> }) => {
  //         cache.readQuery({query: "draftMessages"})
  //     //     console.log("STORE", _, "CACHE", cache);

  //     //     return {
  //     //       __typename: "DraftMessage",
  //     //       id: channelId,
  //     //       text: "laber"
  //     //     };
  //     //   }
  //     // },
  //     Mutation: {
  //       updateDraftMessage: (_: any, { channelId, newText }: { channelId: string; newText: string }, { cache }: any) => {
  //         console.log("channelId", channelId, "newText", newText);
  //         cache.writeData({
  //           data: {
  //             drafts: {
  //               __typename: "Drafts",
  //               [channelId]: {
  //                 id: channelId,
  //                 __typename: "DraftMessage",
  //                 text: newText
  //               }
  //             }
  //           }
  //         });
  //         return null;
  //       },
  //       setCurrentChannel: (_: any, { currentChannelId }: { currentChannelId: string }, { cache }: any) => {
  //         cache.writeData({ data: { currentChannel: { currentChannelId } } });
  //         return null;
  //       }
  //     }
  //   }
  // }
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
