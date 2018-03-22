import * as React from "react";
import * as ReactDOM from "react-dom";
import { RouteComponentProps, Link } from "react-router-dom";

import * as styles from "./Channel.scss";
import * as classNames from "classnames";

import { Message } from "./types";
import { longDate } from "./utils";

import { Row, Col } from "./layout";

import { gql, ApolloClient } from "apollo-boost";
import { Query } from "react-apollo";

import { ChannelQuery, ChannelQueryVariables, ChannelQuery_channel } from "./__generated__/ChannelQuery";
import {
  PostNewMessageMutation,
  PostNewMessageMutationVariables,
  PostNewMessageMutation_postMessage
} from "./__generated__/PostNewMessageMutation";

import Avatar from "./Avatar";
import ArrowButton from "./ArrowButton";

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

interface ChannelTitleProps {
  channel: ChannelQuery_channel;
}

interface ChannelTitleState {
  expanded: boolean;
}

class ChannelTitle extends React.Component<ChannelTitleProps, ChannelTitleState> {
  readonly state: ChannelTitleState = { expanded: false };

  render() {
    const { expanded } = this.state;
    const { channel: { title, members } } = this.props;
    const memberNames = expanded && members.map(m => m.name).join(", ");

    return (
      <Row className={styles.Title}>
        <Col>
          <h1>{title}</h1>
        </Col>
        <Col xs="auto">
          <ArrowButton direction={expanded ? "up" : "down"} onClick={() => this.setState({ expanded: !expanded })} />
        </Col>
        {expanded && (
          <Col xs={12}>
            {members.length} Members: {memberNames}
          </Col>
        )}
      </Row>
    );
  }
}

interface ChannelProps extends RouteComponentProps<{ currentChannelId: string }> {}

export default function Channel({ match: { params: { currentChannelId } } }: ChannelProps) {
  return (
    <div className={styles.Channel}>
      <ChannelQueryComponent query={CHANNEL_QUERY} variables={{ channelId: currentChannelId }}>
        {function({ loading, error, data, client }) {
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
          const { messages } = channel;
          console.log("DATA...", data);

          return (
            <React.Fragment>
              <ChannelTitle channel={channel} />

              {messages.map(message => (
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
              <Row className={styles.Editor}>
                <Col className={styles.Form}>
                  <MessageEditor
                    onNewMessage={newValue => {
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
                    }}
                  />
                </Col>
              </Row>
            </React.Fragment>
          );
        }}
      </ChannelQueryComponent>
    </div>
  );
}

interface MessageEditorProps {
  onNewMessage(newMessage: string): void;
}

interface MessageEditorState {
  newMessage: string;
}

class MessageEditor extends React.Component<MessageEditorProps, MessageEditorState> {
  readonly state: MessageEditorState = {
    newMessage: ""
  };

  onSendClick = () => {
    const { newMessage } = this.state;
    const { onNewMessage } = this.props;

    onNewMessage(newMessage.trim());
    this.setState({ newMessage: "" });
  };

  render() {
    const { newMessage } = this.state;
    return (
      <React.Fragment>
        <textarea
          placeholder="Enter your message"
          value={newMessage}
          rows={1}
          onChange={e => this.setState({ newMessage: e.currentTarget.value })}
        />
        <button disabled={newMessage.trim().length === 0} onClick={this.onSendClick}>
          Send
        </button>
      </React.Fragment>
    );
  }
}
