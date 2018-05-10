/* necessary for backward compat */
export * from "apollo-client";
export * from "apollo-link";
export * from "apollo-cache-inmemory";

import { Operation, ApolloLink, Observable } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { withClientState, ClientStateConfig } from "apollo-link-state";
import { onError, ErrorLink } from "apollo-link-error";

import { InMemoryCache, CacheResolverMap } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";

export { gql, InMemoryCache, HttpLink };

export interface PresetConfig {
  request?: (operation: Operation) => Promise<void>;
  uri?: string;
  fetchOptions?: HttpLink.Options;
  clientState?: ClientStateConfig;
  onError?: ErrorLink.ErrorHandler;
  cacheRedirects?: CacheResolverMap;
}

// ---------
// Apollo Boost does not support WebSocketLink for Subscriptions (yet)
// so this file is a copy of https://raw.githubusercontent.com/apollographql/apollo-client/24988ead4cdb26fd1534665965995ac3b188a126/packages/apollo-boost/src/index.ts
// ...with changes according to the docs:
// https://www.apollographql.com/docs/react/features/subscriptions.html

// Feature Request for WS/Subscriptions support in Boost:
// https://github.com/apollographql/apollo-client/issues/3024
// see: https://github.com/apollographql/apollo-client/issues/3117

import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
interface PresetConfigWithWSLink extends PresetConfig {
  webSocketLink: WebSocketLink;
}

// ---------

export default class DefaultClient<TCache> extends ApolloClient<TCache> {
  constructor(config: PresetConfigWithWSLink) {
    const cache =
      config && config.cacheRedirects ? new InMemoryCache({ cacheRedirects: config.cacheRedirects }) : new InMemoryCache();

    const stateLink = config && config.clientState ? withClientState({ ...config.clientState, cache }) : false;

    const errorLink =
      config && config.onError
        ? onError(config.onError)
        : onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
              graphQLErrors.map(({ message, locations, path }) =>
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
              );
            if (networkError) console.log(`[Network error]: ${networkError}`);
          });

    const requestHandler =
      config && config.request
        ? new ApolloLink(
            (operation, forward) =>
              new Observable(observer => {
                let handle: any;
                Promise.resolve(operation)
                  .then(oper => config.request && config.request(oper))
                  .then(() => {
                    handle =
                      forward &&
                      forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer)
                      });
                  })
                  .catch(observer.error.bind(observer));

                return () => {
                  if (handle) handle.unsubscribe;
                };
              })
          )
        : false;

    const httpLink = new HttpLink({
      uri: (config && config.uri) || "/graphql",
      fetchOptions: (config && config.fetchOptions) || {},
      credentials: "same-origin"
    });

    const splitLink = split(
      // split based on operation type
      ({ query }) => {
        const result = getMainDefinition(query);
        if (result.kind === "OperationDefinition") {
          return result.operation === "subscription";
        }
        return false;
        // const { kind, operation } = getMainDefinition(query);
        // return kind === "OperationDefinition" && operation === "subscription";
      },
      config.webSocketLink,
      httpLink
    );

    const link = ApolloLink.from([errorLink, requestHandler, stateLink, splitLink].filter(x => !!x) as ApolloLink[]);

    // super hacky, we will fix the types eventually
    super({ cache, link } as any);
  }
}
