import * as React from "react";

import * as classNames from "classnames";

import { gql, gql as clientGql, SubscribeToMoreOptions } from "apollo-boost";
import { Query, Subscription } from "react-apollo";
import {
  ChannelListQueryResult,
  ChannelListQueryVariables,
  ChannelListQueryResult_channels
} from "./__generated__/ChannelListQuery";
import { RouteComponentProps } from "react-router-dom";

import { CurrentUser } from "../components";
import { NewMessageSubscriptionResult, NewMessageSubscriptionResult_messageAdded } from "./__generated__/NewMessageSubscription";
import { DraftMessage, SubscribeToMoreFn } from "../types";
import { ChannelQueryResult, ChannelQueryResult_channel } from "../Channel/__generated__/ChannelQuery";
import ChannelManager from "./ChannelManager";
import MessageCard from "./MessageCard";
import { ChannelAddedSubscriptionResult } from "./__generated__/ChannelAddedSubscription";

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessageSubscription($channelIds: [String!]!) {
    messageAdded(channelIds: $channelIds) {
      id
      date
      text

      author {
        id
        name
      }

      channel {
        id
      }
    }
  }
`;

const CHANNEL_ADDED_SUBSCRIPTION = gql`
  subscription ChannelAddedSubscription {
    addedToChannel {
      id
      title

      owner {
        id
      }

      latestMessage {
        id
        date
        author {
          id
          name
        }
        text
      }
    }
  }
`;

const DRAFT_MESSAGES_QUERY = clientGql`
  query GetDraftMessages {
    draftMessages @client {
      id
      text
    }
  }
`;

const CHANNEL_LIST_QUERY = gql`
  query ChannelListQuery($memberId: String) {
    channels(memberId: $memberId) {
      id
      title

      owner {
        id
      }

      latestMessage {
        id
        date
        author {
          id
          name
        }
        text
      }
    }
  }
`;

function subscribeToNewMessages(subscribeToMore: SubscribeToMoreFn, channelIds: string[]) {
  subscribeToMore({
    document: CHANNEL_ADDED_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      // QUESTION: why is updatequery untyped ??? https://github.com/apollographql/apollo-client/issues/3391
      const subscriptionResult = subscriptionData.data as ChannelAddedSubscriptionResult;
      const prevQueryChannelResult: ChannelListQueryResult = prev as ChannelListQueryResult;

      return {
        ...prevQueryChannelResult,
        channels: [...prevQueryChannelResult.channels, subscriptionResult.addedToChannel]
      };
    }
  });
  subscribeToMore({
    document: NEW_MESSAGE_SUBSCRIPTION,
    variables: {
      channelIds
    },
    updateQuery: (prev, { subscriptionData }) => {
      // QUESTION: why is updatequery untyped ??? https://github.com/apollographql/apollo-client/issues/3391
      const subscriptionResult = subscriptionData.data as NewMessageSubscriptionResult;
      const prevQueryChannelResult: ChannelListQueryResult = prev as ChannelListQueryResult;
      if (!subscriptionResult) return prevQueryChannelResult;

      const newChannels = prevQueryChannelResult.channels.map(
        ec =>
          ec.id === subscriptionResult.messageAdded.channel.id
            ? {
                ...ec,
                latestMessage: subscriptionResult.messageAdded
              }
            : ec
      );

      return {
        ...prevQueryChannelResult,
        channels: newChannels
      };
    }
  });
}

class ChannelListQuery extends Query<ChannelListQueryResult, ChannelListQueryVariables> {}

interface ChannelListProps extends RouteComponentProps<{ currentChannelId: string }> {}

export default function ChannelList({ match }: ChannelListProps) {
  return (
    <CurrentUser>
      {({ id: currentUserId }) => (
        <ChannelListQuery
          query={CHANNEL_LIST_QUERY}
          variables={{
            memberId: currentUserId
          }}
        >
          {({ loading, error, subscribeToMore, client, data = { channels: [] } }) => {
            if (error) {
              return (
                <div>
                  <h1>Error</h1>
                  <pre>{JSON.stringify(error)}</pre>
                </div>
              );
            }

            if (loading) {
              return <h1>Please wait</h1>;
            }

            return (
              <Query query={DRAFT_MESSAGES_QUERY}>
                {({ data: draftMessageQueryResult }) => {
                  const draftMessages: DraftMessage[] = draftMessageQueryResult.draftMessages;
                  const subscribedChannelIds = data.channels.map(channel => channel.id);

                  return (
                    <ChannelListWithData
                      subscribeToNewMessages={() => subscribeToNewMessages(subscribeToMore, subscribedChannelIds)}
                      currentUserId={currentUserId}
                      currentChannelId={match.params.currentChannelId}
                      draftMessages={draftMessages}
                      channels={data.channels}
                    />
                  );
                }}
              </Query>
            );
          }}
        </ChannelListQuery>
      )}
    </CurrentUser>
  );
}

interface ChannelListWithDataProps {
  subscribeToNewMessages(): void;
  currentUserId: string;
  currentChannelId: string;
  draftMessages: DraftMessage[];
  channels: ChannelListQueryResult_channels[];
}
class ChannelListWithData extends React.Component<ChannelListWithDataProps> {
  render() {
    const { draftMessages, channels, currentUserId, currentChannelId } = this.props;

    const getDraftMessageForChannel = (channelId: string) => {
      const r = draftMessages.find(dm => dm.id === channelId);
      return r ? r.text : null;
    };

    return channels.map(channel => (
      <div key={channel.id}>
        <MessageCard
          channelId={channel.id}
          title={channel.title}
          isOwner={channel.owner.id === currentUserId}
          author={channel.latestMessage.author.name}
          lastMessage={channel.latestMessage.text}
          draftMessage={getDraftMessageForChannel(channel.id)}
          date={channel.latestMessage.date}
          active={channel.id === currentChannelId}
        />
      </div>
    ));
  }

  componentDidMount() {
    // https://www.apollographql.com/docs/react/advanced/subscriptions.html#subscribe-to-more
    this.props.subscribeToNewMessages();
  }
}
