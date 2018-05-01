import * as React from "react";
import * as styles from "./Channel.scss";
import Avatar from "../components/Avatar";
import { longDate } from "../utils";
import { Row, Col } from "../layout";
import { ChannelQueryResult_channel_messages } from "./__generated__/ChannelQuery";

interface MessageViewProps {
  message: ChannelQueryResult_channel_messages;
}

export default function MessageView({ message }: MessageViewProps) {
  return (
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
  );
}
