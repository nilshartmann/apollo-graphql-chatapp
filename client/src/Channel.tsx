import * as React from "react";
import * as ReactDOM from "react-dom";
import { RouteComponentProps, Link } from "react-router-dom";

import * as styles from "./Channel.scss";
import * as classNames from "classnames";

import { Message } from "./types";
import { longDate } from "./utils";

import { Row, Col } from "./layout";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import { ChannelQuery, ChannelQueryVariables } from "./__generated__/ChannelQuery";

interface ChannelProps extends RouteComponentProps<{ currentChannelId: string }> {
  title: string;
  messages: Message[];
}

const CHANNEL_QUERY = gql`
  query ChannelQuery($channelId: String!) {
    currentChannel @client {
      currentChannelId
    }
    channel(channelId: $channelId) {
      id
      title
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

class ChannelQueryComponent extends Query<ChannelQuery, ChannelQueryVariables> {}

export default function Channel({ title, messages, match }: ChannelProps) {
  return (
    <div className={styles.Channel}>
      <ChannelQueryComponent query={CHANNEL_QUERY} variables={{ channelId: match.params.currentChannelId }}>
        {function({ loading, error, data }) {
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

          console.log("DATA", data);

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
            <React.Fragment>
              <Row className={styles.Title}>
                <Col>
                  <h1>{channel.title}</h1>
                </Col>
              </Row>
              {channel.messages.map(message => (
                <Row className={styles.Message}>
                  <Col xs={2}>
                    <img src={`/avatars/${message.author.id}.svg`} />
                  </Col>
                  <Col>
                    <h1>{message.author.name}</h1>
                    {message.text}
                    <div className={styles.Date}>{longDate(message.date)}</div>
                  </Col>
                </Row>
              ))}
            </React.Fragment>
          );
        }}
      </ChannelQueryComponent>
    </div>
  );
}
