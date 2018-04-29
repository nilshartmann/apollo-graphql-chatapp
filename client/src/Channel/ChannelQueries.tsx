import { gql as clientGql, gql } from "apollo-boost";
import { Query } from "react-apollo";
import { ChannelQuery as ChannelQueryResult, ChannelQueryVariables } from "./__generated__/ChannelQuery";
import { DraftMessage } from "../types";

export type ChannelQueryResult = ChannelQueryResult;

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

export const UPDATE_DRAFT_CLIENT_MUTATION = clientGql`
  mutation updateDraftMutation($channelId: String!, $text: String!) {
    setDraftMessageForChannel(channelId: $channelId, text: $text) @client {
      id
      text
    }
  }
`;

interface QDraftMessageForChannel {
  draftMessageForChannel: DraftMessage | null;
}

interface QDraftMessageForChannelVariables {
  channelId: string;
}

export const DRAFT_MESSAGE_FOR_CHANNEL_QUERY = clientGql`
  query QGetDraftMessageForChannel($channelId: String!)  {
    draftMessageForChannel(channelId: $channelId) @client
  }
  `;

export class DraftMessageForChannelQuery extends Query<QDraftMessageForChannel, QDraftMessageForChannelVariables> {}
