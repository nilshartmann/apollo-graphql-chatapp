import ApolloClient, { gql as clientGql } from "./boost_patch/ApolloClientWithWebsockets";
import { ApolloCache } from "apollo-cache";
import { DraftMessage } from "./types";
export const defaults = {
  draftMessages: []
};

export const resolvers = {
  Mutation: {
    // QUESTION: is there are better way to implement?
    //   something like "update or insert"?
    setDraftMessageForChannel: (
      _: any,
      { channelId, text }: { channelId: string; text: string },
      { cache }: { cache: ApolloCache<any> }
    ) => {
      const id = `DraftMessage:${channelId}`;
      const fragment = clientGql`
        fragment draftMessage on DraftMessage {
          id
          text
        }
      `;
      const existingDraftMessage = cache.readFragment({ fragment, id }) as DraftMessage;
      if (existingDraftMessage) {
        // already available
        const data = { ...existingDraftMessage, text };
        cache.writeData({ id, data });
        return data;
      }

      const currentDraftMessages: {
        draftMessages: DraftMessage[];
      } | null = cache.readQuery({
        query: clientGql`
          query getDraftMessages @client {
            draftMessages {
              id
              text
            }
          }
        `
      });
      if (!currentDraftMessages) {
        // this should not happen as we initialize the state with an empty array
        return;
      }
      const newDraftMessage = {
        id: channelId,
        text,
        __typename: "DraftMessage"
      };

      const data = {
        draftMessages: currentDraftMessages.draftMessages.concat([newDraftMessage])
      };

      cache.writeData({ data });

      return newDraftMessage;
    }
  },
  Query: {
    draftMessageForChannel: (_: any, { channelId }: { channelId: string }, { cache }: { cache: ApolloCache<any> }) => {
      const fragment = clientGql`
        fragment draftMessage on DraftMessage {
          id
          text
        }
      `;
      const id = `DraftMessage:${channelId}`;
      const ret = cache.readFragment({ fragment, id }) as { text: string } | null;

      return ret;
    }
    // // this resolver is currently not used and not needed, but:
    // // QUESTION: are they correctly implementend?
    // // QUESTION: if someone uses it and the list of draft messages gets updated, the query is not re-run
    // //           automatically. how to refresh consumers of this query?
    // draftMessageForChannels: (_: any, { channelIds }: { channelIds: string[] }, { cache }: { cache: ApolloCache<any> }) => {
    //   const allDraftMessagesResult: {
    //     draftMessages: DraftMessage[];
    //   } | null = cache.readQuery({
    //     query: gql`
    //       query getDraftMessages @client {
    //         draftMessages {
    //           id
    //           text
    //         }
    //       }
    //     `
    //   });

    //   if (!allDraftMessagesResult) {
    //     return [];
    //   }

    //   const result = allDraftMessagesResult.draftMessages.filter(am => channelIds.includes(am.id));
    //   return result;
    // },
  }
};
