import { gql as clientGql, gql } from "apollo-boost";
import { Query } from "react-apollo";
import { ChannelQueryResult, ChannelQueryVariables } from "./__generated__/ChannelQuery";
import { DraftMessage } from "../types";

export { ChannelQueryResult } from "./__generated__/ChannelQuery";

export const CHANNEL_QUERY = gql`
  query ChannelQuery($channelId: String!) {
    channel(channelId: $channelId) {
      id
      title
      members {
        id
        name
      }
      messages {
        id
        text
        date
        author {
          id
          name
        }
      }
    }
  }
`;

export class ChannelQuery extends Query<ChannelQueryResult, ChannelQueryVariables> {}

// fields must be same as in CHANNEL_QUERY. TODO: could use a Fragment here...
export const ON_NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription OnNewMessageSubscription($channelId: String!) {
    messageAdded(channelIds: [$channelId]) {
      id
      text
      date
      author {
        id
        name
      }
    }
  }
`;

export const POST_NEW_MESSAGE_MUTATION = gql`
  mutation PostNewMessageMutation($channelId: String!, $authorId: String!, $message: String!) {
    postMessage(channelId: $channelId, authorId: $authorId, message: $message) {
      id
      text
      date
      author {
        name
        id
      }
    }
  }
`;

// use "clientGql" here as apollo codegen does not work
// with @client directive currently
// (https://github.com/apollographql/apollo-codegen/issues/366)
// as apollo codegen only looks for 'gql' tag,
// it ignores this query
export const UPDATE_DRAFT_CLIENT_MUTATION = clientGql`
  mutation updateDraftMutation($channelId: String!, $text: String!) {
    setDraftMessageForChannel(channelId: $channelId, text: $text) @client {
      id
      text
    }
  }
`;

interface DraftMessageForChannelQueryResult {
  draftMessageForChannel: DraftMessage | null;
}

interface DraftMessageForChannelQueryVariables {
  channelId: string;
}

export const DRAFT_MESSAGE_FOR_CHANNEL_QUERY = clientGql`
  query GetDraftMessageForChannel($channelId: String!)  {
    draftMessageForChannel(channelId: $channelId) @client
  }
  `;

export class DraftMessageForChannelQuery extends Query<DraftMessageForChannelQueryResult, DraftMessageForChannelQueryVariables> {}
