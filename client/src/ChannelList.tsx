import * as React from "react";

import * as styles from "./ChannelList.scss";
import * as classNames from "classnames";

import { Row, Col } from "./layout";

import { gql } from "apollo-boost";
import { Query, Subscription } from "react-apollo";
import { timeOnly } from "./utils";
import { ChannelListQuery, ChannelListQueryVariables } from "./__generated__/ChannelListQuery";
import { RouteComponentProps, Link } from "react-router-dom";

import CurrentUser from "./CurrentUser";
import { NewMessageSubscription } from "./__generated__/NewMessageSubscription";

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessageSubscription {
    messageAdded {
      id
      date
      author {
        id
        name
      }
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
  console.log("MATCH", match);

  return (
    <CurrentUser>
      {({ id: currentUserId }) => (
        <ChannelListQueryComponent
          query={CHANNEL_LIST_QUERY}
          variables={{
            memberId: currentUserId
          }}
        >
          {function({ loading, error, subscribeToMore, data = { channels: [] } }) {
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
              <React.Fragment>
                {/* <NewMessageSubscriptionComponent query={NEW_MESSAGE_SUBSCRIPTION}>
                  {function({ data, loading, error }) {
                    console.log("SUBSCRIPTION loading: " + loading + " error: " + error);
                    console.log("             data");
                    console.log("NEW MESSAGE", data && data.messageAdded);
                    return <h1>subscri</h1>;
                  }}
                </NewMessageSubscriptionComponent> */}
                {data.channels.map(channel => (
                  <ChannelCard
                    key={channel.id}
                    channelId={channel.id}
                    title={channel.title}
                    author={channel.latestMessage.author.name}
                    lastMessage={channel.latestMessage.text}
                    date={channel.latestMessage.date}
                    active={channel.id === match.params.currentChannelId}
                  />
                ))}
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
  draft?: boolean;
}
function ChannelCard({
  channelId,
  title,
  active = false,
  author,
  lastMessage,
  date,
  unreadMessageCount,
  draft
}: ChannelCardProps) {
  const classnames = classNames(styles.ChannelCardContent, { [styles.active]: active });

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
              <div className={styles.latestMessageAbstractMessage}>
                {author}: {lastMessage}
              </div>
              <div className={styles.latestMessageAbstractDate}>{draft ? <span>(Draft)</span> : timeOnly(date)}</div>
            </div>
          </div>
        </Col>
      </Row>
    </Link>
  );
}
