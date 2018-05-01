import * as React from "react";

import * as styles from "./ChannelList.scss";
import * as classNames from "classnames";

import { Row, Col } from "../layout";

import { gql, gql as clientGql } from "apollo-boost";
import { Query, Subscription } from "react-apollo";
import { timeOnly } from "../utils";
import {
  ChannelListQueryResult,
  ChannelListQueryVariables,
  ChannelListQueryResult_channels
} from "./__generated__/ChannelListQuery";
import { RouteComponentProps, Link } from "react-router-dom";

import { CurrentUser } from "../components";
import { NewMessageSubscriptionResult, NewMessageSubscriptionResult_messageAdded } from "./__generated__/NewMessageSubscription";
import { DraftMessage } from "../types";
import { ChannelQueryResult, ChannelQueryResult_channel } from "../Channel/__generated__/ChannelQuery";

import { ChannelFragmentResult } from "./__generated__/ChannelFragment";

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

            function subscribeToNewMessages() {
              subscribeToMore({
                document: NEW_MESSAGE_SUBSCRIPTION,
                variables: {
                  channelIds: data.channels.map(channel => channel.id)
                },
                updateQuery: (prev, { subscriptionData }) => {
                  // QUESTION: why is updatequery untyped ??? https://github.com/apollographql/apollo-client/issues/3391
                  const subscriptionResult = subscriptionData.data as NewMessageSubscriptionResult;
                  const prevQueryChannelResult: ChannelListQueryResult = prev as ChannelListQueryResult;

                  console.log("UPDATE QUERY prev:", prev);
                  console.log("UPDATE QUERY data", subscriptionData.data);

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

            return (
              <Query query={DRAFT_MESSAGES_QUERY}>
                {({ data: draftMessageQueryResult }) => {
                  const draftMessages: DraftMessage[] = draftMessageQueryResult.draftMessages;

                  return (
                    <ChannelListWithData
                      subscribeToNewMessages={subscribeToNewMessages}
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
  currentChannelId: string;
  draftMessages: DraftMessage[];
  channels: ChannelListQueryResult_channels[];
}

class ChannelListWithData extends React.Component<ChannelListWithDataProps> {
  render() {
    const { draftMessages, channels, currentChannelId } = this.props;
    const getDraftMessageForChannel = (channelId: string) => {
      const r = draftMessages.find(dm => dm.id === channelId);
      return r ? r.text : null;
    };

    return channels.map(channel => (
      <ChannelCard
        key={channel.id}
        channelId={channel.id}
        title={channel.title}
        author={channel.latestMessage.author.name}
        lastMessage={channel.latestMessage.text}
        draftMessage={getDraftMessageForChannel(channel.id)}
        date={channel.latestMessage.date}
        active={channel.id === currentChannelId}
      />
    ));
  }

  componentDidMount() {
    // https://www.apollographql.com/docs/react/advanced/subscriptions.html#subscribe-to-more
    this.props.subscribeToNewMessages();
  }
}

interface ChannelCardProps {
  channelId: string;
  title: string;
  author: string;
  lastMessage: string;
  date: string;
  active?: boolean;
  unreadMessageCount?: number;
  draftMessage?: string | null;
}
function ChannelCard({
  channelId,
  title,
  active = false,
  author,
  lastMessage,
  date,
  unreadMessageCount,
  draftMessage
}: ChannelCardProps) {
  const classnames = classNames(styles.ChannelCardContent, { [styles.active]: active });

  const text = draftMessage ? draftMessage : `${author}: ${lastMessage}`;
  const dateOrDraft = draftMessage ? "(Draft)" : timeOnly(date);

  return (
    <Link to={`/channel/${channelId}`}>
      <Row className={styles.ChannelCard}>
        <Col className={classnames}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row>
              <Col>
                <h1>{title}</h1>
              </Col>
              {unreadMessageCount && (
                <Col xs="auto">
                  <div className={styles.UnreadMessageCounter}>{unreadMessageCount}</div>
                </Col>
              )}
            </Row>

            <div className={styles.latestMessageAbstract}>
              <div className={styles.latestMessageAbstractMessage}>{text}</div>
              <div className={styles.latestMessageAbstractDate}>{dateOrDraft}</div>
            </div>
          </div>
        </Col>
      </Row>
    </Link>
  );
}
