import * as React from "react";
import * as ReactDOM from "react-dom";
import { RouteComponentProps, Link } from "react-router-dom";

import * as styles from "./Channel.scss";
import * as classNames from "classnames";

import { longDate } from "../utils";

import { Row, Col } from "../layout";

import { gql, gql as clientGql, ApolloClient } from "apollo-boost";
import { Query } from "react-apollo";

import {
  ChannelQuery,
  ChannelQueryVariables,
  ChannelQuery_channel,
  ChannelQuery_channel_messages
} from "../__generated__/ChannelQuery";
import {
  PostNewMessageMutation,
  PostNewMessageMutationVariables,
  PostNewMessageMutation_postMessage
} from "../__generated__/PostNewMessageMutation";

import Avatar from "../components/Avatar";
import Button from "../components/Button";

import ChannelTitle from "./ChannelTitle";
import MessageEditor from "./MessageEditor";
import { DraftMessage } from "../types";

const CHANNEL_QUERY = gql`
  query ChannelQuery($channelId: String!) {
    #draftMessage @client {
    #  text
    #}
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

// const UPDATE_DRAFT_MESSAGE = gql`
//   mutation UpdateDraftMessage($channelId: String!, $newText: String!) {
//     updateDraftMessage(channelId: $channelId, newText: $newText) @client
//   }
// `;
class ChannelQueryComponent extends Query<ChannelQuery, ChannelQueryVariables> {}

const POST_NEW_MESSAGE = gql`
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

interface MessagesListProps {
  channel: ChannelQuery_channel;
}
class MessagesList extends React.Component<MessagesListProps> {
  messageListRef: HTMLDivElement | null = null;
  scrollAtBottom: boolean = true;

  scrollToBottom = () => {
    if (!this.messageListRef) {
      return;
    }
    const scrollHeight = this.messageListRef.scrollHeight;
    const height = this.messageListRef.clientHeight;
    const maxScrollTop = scrollHeight - height;
    console.log("ScrollToBottom ", scrollHeight, height, maxScrollTop);
    this.messageListRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  componentWillUpdate(nextProps: MessagesListProps) {
    const newMessageArrived = nextProps.channel.messages.length !== this.props.channel.messages.length;
    if (!newMessageArrived || !this.messageListRef) {
      return;
    }
    const scrollPos = this.messageListRef.scrollTop;
    const scrollBottom = this.messageListRef.scrollHeight - this.messageListRef.clientHeight;
    this.scrollAtBottom = scrollBottom <= 0 || scrollPos === scrollBottom;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    if (this.scrollAtBottom) {
      this.scrollToBottom();
    }
  }
  render() {
    const { channel } = this.props;
    return (
      <div className={styles.MessagesList} ref={r => (this.messageListRef = r)}>
        <ChannelTitle channel={channel} />

        {channel.messages.map(message => (
          <Row key={message.id} className={styles.Message}>
            <Col xs={2}>
              <Avatar userId={message.author.id} />
            </Col>
            <Col>
              <h1>{message.author.name}</h1>
              <div className={styles.Text}>{message.text}</div>
              <div className={styles.Date}>{longDate(message.date)}</div>
            </Col>
          </Row>
        ))}
      </div>
    );
  }
}

interface ChannelProps extends RouteComponentProps<{ currentChannelId: string }> {}

export default class Channel extends React.Component<ChannelProps> {
  publishDraftMessage = (client: ApolloClient<any>, currentChannelId: string, newValue: string) => {
    console.log("NEW VALUE", newValue);
    console.log("currentChannelId", currentChannelId);
    client.mutate({
      mutation: gql`
        mutation updateDraftMutation($channelId: string!, $text: string!) {
          setDraftMessageForChannel(channelId: $channelId, text: $text) @client {
            id
            text
          }
        }
      `,
      variables: {
        channelId: currentChannelId,
        authorId: "u5",
        text: newValue
      },
      // QUESTION: that is not so nice, as we have to know all other queries that
      //           might depend on this mutation
      refetchQueries: [
        {
          query: DRAFT_MESSAGE_FOR_CHANNEL_QUERY,
          variables: {
            channelId: currentChannelId
          }
        }
      ]
    });
  };

  postNewMessage = (client: ApolloClient<any>, currentChannelId: string, newValue: string) => {
    client.mutate<PostNewMessageMutation>({
      mutation: POST_NEW_MESSAGE,
      variables: {
        channelId: currentChannelId,
        authorId: "u5",
        message: newValue
      } as PostNewMessageMutationVariables,
      update: (proxy, { data }) => {
        const postMessage: PostNewMessageMutation_postMessage = data && data.postMessage;
        if (!postMessage) {
          return;
        }
        const existingChannel = proxy.readQuery<ChannelQuery>({
          query: CHANNEL_QUERY,
          variables: {
            channelId: currentChannelId
          } as ChannelQueryVariables
        });

        if (!existingChannel || !existingChannel.channel) {
          return;
        }

        existingChannel.channel.messages.push(postMessage);

        proxy.writeQuery({ query: CHANNEL_QUERY, data: existingChannel });
      }
    });
  };

  render() {
    const { match: { params: { currentChannelId } } } = this.props;
    return (
      <div className={styles.Channel}>
        <ChannelQueryComponent query={CHANNEL_QUERY} variables={{ channelId: currentChannelId }}>
          {({ loading, error, data, client }) => {
            if (loading) {
              return (
                <Row className={styles.Title}>
                  <Col>
                    <h1>Loading Data...</h1>
                  </Col>
                </Row>
              );
            }

            if (error) {
              return (
                <Row className={styles.Title}>
                  <Col>
                    <h1>Error</h1>
                    <p>
                      <pre>{JSON.stringify(error)}</pre>
                    </p>
                  </Col>
                </Row>
              );
            }

            if (!data || !data.channel) {
              return (
                <Row className={styles.Title}>
                  <Col>
                    <h1>Not Found</h1>
                    <p>Channel not found</p>
                  </Col>
                </Row>
              );
            }
            const { channel } = data;
            return (
              <div className={styles.XXX}>
                <MessagesList channel={channel} />
                <Row className={styles.Editor}>
                  <Col className={styles.Form}>
                    <DraftMessageForChannelQuery
                      query={DRAFT_MESSAGE_FOR_CHANNEL_QUERY}
                      variables={{ channelId: currentChannelId }}
                    >
                      {({ data: result }) => {
                        console.log("'### draftMessage", result);
                        const message = (result && result.draftMessageForChannel && result.draftMessageForChannel.text) || "";
                        return (
                          <MessageEditor
                            message={message}
                            onMessageChange={currentValue => this.publishDraftMessage(client, currentChannelId, currentValue)}
                            onNewMessage={newValue => this.postNewMessage(client, currentChannelId, newValue)}
                          />
                        );
                      }}
                    </DraftMessageForChannelQuery>
                  </Col>
                </Row>
              </div>
            );
          }}
        </ChannelQueryComponent>
      </div>
    );
  }
}

interface QDraftMessageForChannel {
  draftMessageForChannel: DraftMessage | null;
}

interface QDraftMessageForChannelVariables {
  channelId: string;
}

const DRAFT_MESSAGE_FOR_CHANNEL_QUERY = clientGql`
  query QGetDraftMessageForChannel($channelId: String!)  {
    draftMessageForChannel(channelId: $channelId) @client
  }
  `;

class DraftMessageForChannelQuery extends Query<QDraftMessageForChannel, QDraftMessageForChannelVariables> {}
