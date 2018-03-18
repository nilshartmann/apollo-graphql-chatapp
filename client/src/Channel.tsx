import * as React from "react";
import * as ReactDOM from "react-dom";

import * as styles from "./Channel.scss";
import * as classNames from "classnames";

import { Message } from "./types";

import { Row, Col } from "./layout";

interface ChannelProps {
  title: string;
  messages: Message[];
}

import * as moment from "moment";

const readableDate = (date: string) => moment(date).format("D. MMMM, H:mm");

export default function Channel({ title, messages }: ChannelProps) {
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
