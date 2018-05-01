import * as React from "react";

import * as styles from "./ChannelList.scss";
import * as classNames from "classnames";
import { Row, Col } from "../layout";
import { Link } from "react-router-dom";
import { timeOnly } from "../utils";

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

export default function ChannelCard({
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
