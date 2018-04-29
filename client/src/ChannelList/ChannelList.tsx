import * as React from "react";

import * as styles from "./ChannelList.scss";
import * as classNames from "classnames";

import { Row, Col } from "../layout";

import { gql, gql as clientGql } from "apollo-boost";
import { Query, Subscription } from "react-apollo";
import { timeOnly } from "../utils";
import { ChannelListQuery, ChannelListQueryVariables } from "./__generated__/ChannelListQuery";
import { RouteComponentProps, Link } from "react-router-dom";

import { CurrentUser } from "../components";
import { NewMessageSubscription, NewMessageSubscription_messageAdded } from "./__generated__/NewMessageSubscription";
import { DraftMessage } from "../types";
import { ChannelQuery, ChannelQuery_channel } from "../Channel/__generated__/ChannelQuery";

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

class ChannelListQueryComponent extends Query<ChannelListQuery, ChannelListQueryVariables> {}
class NewMessageSubscriptionComponent extends Subscription<NewMessageSubscription> {}
interface ChannelListProps extends RouteComponentProps<{ currentChannelId: string }> {}
export default function ChannelList({ match }: ChannelListProps) {
  return (
    <CurrentUser>
      {({ id: currentUserId }) => (
        <ChannelListQueryComponent
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

            subscribeToMore({
              document: NEW_MESSAGE_SUBSCRIPTION,
              variables: {
                channelIds: data.channels.map(channel => channel.id)
              },
              updateQuery: (prev, { subscriptionData }) => {
                // QUESTION: why is updatequery untyped ???
                console.log("UPDATE QUERY prev:", prev);
                console.log("UPDATE QUERY cur", subscriptionData);

                const data: NewMessageSubscription | null = subscriptionData.data;

                if (!data) return prev;

                const bla: any = prev;
                const existingChannels: ChannelQuery_channel[] = bla.channels;

                const updateChannel = (c: ChannelQuery_channel, newLatestMessage: NewMessageSubscription_messageAdded) => {
                  const newMessage = { ...data.messageAdded, text: data.messageAdded.text + "ZZ" };
                  const updatedChannel = Object.assign({}, c, { latestMessage: data.messageAdded });
                  return updatedChannel;
                };

                const newChannels = existingChannels.map(
                  ec => (ec.id === data.messageAdded.channel.id ? updateChannel(ec, data.messageAdded) : ec)
                );

                const myChannel = gql`
                  fragment myChannel on Channel {
                    messages {
                      id
                      text
                    }
                  }
                `;

                const f: any = client.readFragment({
                  id: `Channel:${data.messageAdded.channel.id}`,
                  fragment: myChannel
                });

                console.log("f: ===>");
                console.dir(f);

                const newChannelList = { ...f, messages: f.messages.concat(data.messageAdded) };

                console.log("newChannelList: ===>");
                console.dir(newChannelList);

                if (!f.messages.find((m: any) => m.id === data.messageAdded.id)) {
                  console.log(`Add Message with id ${data.messageAdded.id} (${data.messageAdded.text})...`);
                  client.writeFragment({
                    id: `Channel:${data.messageAdded.channel.id}`,
                    fragment: myChannel,
                    data: newChannelList
                  });
                } else {
                  console.log(` Message with id ${data.messageAdded.id} (${data.messageAdded.text}) already in cache...`);
                }

                // return prev;

                return Object.assign({}, prev, {
                  channels: newChannels
                });
              }
            });

            return (
              <React.Fragment>
                {/* <NewMessageSubscriptionComponent query={NEW_MESSAGE_SUBSCRIPTION} variables={{ channelIds }}>
                  {function({ data, loading, error }) {
                    console.log("SUBSCRIPTION loading: " + loading + " error: " + error);
                    console.log("             data");
                    console.log("NEW MESSAGE", data && data.messageAdded);
                    return <div>{data && JSON.stringify(data.messageAdded)}</div>;
                  }}
                </NewMessageSubscriptionComponent> */}
                <Query query={DRAFT_MESSAGES_QUERY}>
                  {({ data: draftMessageQueryResult }) => {
                    const draftMessages: DraftMessage[] = draftMessageQueryResult.draftMessages;

                    const getDraftMessageForChannel = (channelId: string) => {
                      const r = draftMessages.find(dm => dm.id === channelId);

                      return r ? r.text : null;
                    };

                    return data.channels.map(channel => (
                      <ChannelCard
                        key={channel.id}
                        channelId={channel.id}
                        title={channel.title}
                        author={channel.latestMessage.author.name}
                        lastMessage={channel.latestMessage.text}
                        draftMessage={getDraftMessageForChannel(channel.id)}
                        date={channel.latestMessage.date}
                        active={channel.id === match.params.currentChannelId}
                      />
                    ));
                  }}
                </Query>
              </React.Fragment>
            );
          }}
        </ChannelListQueryComponent>
      )}
    </CurrentUser>
  );
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
