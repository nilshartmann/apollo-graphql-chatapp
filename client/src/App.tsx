import * as React from "react";
import * as ReactDOM from "react-dom";

import * as styles from "./chat-app.scss";
import * as classNames from "classnames";

import { Grid, Row, Col } from "./layout";

import Channels from "./Channels";

const HOME = "https://github.com/nilshartmann/apollo-graphql-chatapp";

export default function App() {
  return (
    <Grid className={styles.AppFrame} style={{}}>
      <Row className={styles.Header} align="center">
        <Col>
          <h1>GraphQL Chat App</h1>
        </Col>
        <Col xs="auto">
          <h3>Klaus</h3>
        </Col>
      </Row>
      <Row className={styles.Main}>
        <Col xs={3} style={{ overflowY: "auto", height: "100%" }}>
          <Channels />
        </Col>
        <Col style={{ overflowY: "auto", height: "100%" }}>
          <Channel title={channels[0].title} messages={channels[0].messages} />
        </Col>
      </Row>

      <Row className={styles.Footer} align="center">
        <Col>
          <h3>
            <a href={HOME} target="_blank">
              {HOME}
            </a>
          </h3>
        </Col>
      </Row>
    </Grid>
  );
}
import channels from "../../server/src/mocks/channels";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  date: string;
  author: User;
}

interface ChannelProps {
  title: string;
  messages: Message[];
}

import * as moment from "moment";

const readableDate = (date: string) => moment(date).format("D. MMMM, H:mm");

function Channel({ title, messages }: ChannelProps) {
  return (
    <div className={styles.Channel}>
      <Row className={styles.Title}>
        <Col>
          <h1>{title}</h1>
        </Col>
      </Row>
      {messages.map(message => (
        <Row className={styles.Message}>
          <Col xs={2}>
            <img src={`/avatars/${message.author.id}.svg`} />
          </Col>
          <Col>
            <h1>{message.author.name}</h1>
            {message.text}
            <div className={styles.Date}>{readableDate(message.date)}</div>
          </Col>
        </Row>
      ))}
    </div>
  );
}
