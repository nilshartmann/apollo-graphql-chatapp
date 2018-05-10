import * as React from "react";

import * as styles from "./MessageCard.scss";
import * as classNames from "classnames";
import { Row, Col } from "../layout";
import { Link } from "react-router-dom";
import { timeOnly } from "../utils";

import ArrowButton from "../components/ArrowButton";

interface MessageCardProps {
  channelId: string;
  title: string;
  author: string;
  lastMessage: string;
  date: string;
  active?: boolean;
  draftMessage?: string | null;
  isOwner: boolean;
}

export default function MessageCard({
  channelId,
  title,
  active = false,
  author,
  lastMessage,
  date,
  draftMessage,
  isOwner
}: MessageCardProps) {
  const classnames = classNames(styles.MessageCardContent, { [styles.active]: active });

  const text = draftMessage ? draftMessage : `${author}: ${lastMessage}`;

  return (
    <Link to={`/channel/${channelId}`}>
      <Row className={styles.MessageCard}>
        <Col className={classnames}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row>
              <Col>
                <h1>{title}</h1>
              </Col>
              {isOwner && (
                <Col xs="auto">
                  <div className={styles.OwnerBadge}>Owner</div>
                </Col>
              )}
            </Row>

            <div className={styles.latestMessageAbstract}>
              <div className={styles.latestMessageAbstractMessage}>{text}</div>
              {!!draftMessage && <div className={styles.latestMessageAbstractDraft}>(Draft)</div>}
              {!!draftMessage || <div className={styles.latestMessageAbstractDate}>{timeOnly(date)}</div>}
            </div>
          </div>
        </Col>
      </Row>
    </Link>
  );
}
