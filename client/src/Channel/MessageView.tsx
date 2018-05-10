import * as React from "react";
import * as styles from "./Channel.scss";
import Avatar from "../components/Avatar";
import { longDate } from "../utils";
import { Row, Col } from "../layout";
import { ChannelQueryResult_channel_messages } from "./__generated__/ChannelQuery";

import { Link } from "react-router-dom";

interface MessageViewProps {
  message: ChannelQueryResult_channel_messages;
  channel?: { id: string; title: string };
}

export default function MessageView({ message, channel }: MessageViewProps) {
  return (
    <Row key={message.id} className={styles.Message}>
      <Col xs={2}>
        <Avatar userId={message.author.id} />
      </Col>
      <Col>
        <Link to={`/user/${message.author.id}`}>
          <h1>{message.author.name}</h1>
        </Link>
        <div className={styles.Text}>{message.text}</div>
        <div className={styles.Date}>
          {longDate(message.date)}
          {channel && <Link to={`/channel/${channel.id}`}> in {channel.title}</Link>}
        </div>
      </Col>
    </Row>
  );
}
