import * as React from "react";
import * as ReactDOM from "react-dom";

import * as styles from "./chat-app.scss";
import * as classNames from "classnames";

import { Grid, Row, Col } from "./layout";

export default function App() {
  return (
    <Grid className={styles.AppFrame}>
      <Row className={styles.Header} align="center">
        <Col>
          <h1>GraphQL Chat App</h1>
        </Col>
        <Col xs="auto">
          <h3>Klaus</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <ChannelCard
            title="Channel 1"
            author="Peter"
            lastMessage="Lorem ipsum laber laber"
            date="12.03.2018 13:21"
            unreadMessageCount={3}
          />
          <ChannelCard
            title="Channel 2"
            author="Klaus"
            lastMessage="Veniam quis cow venison andouille, pork loin lorem rump duis kevin swine magna prosciutto. "
            date="12.03.2018 13:21"
            active={true}
          />
          <ChannelCard
            title="Channel 3"
            author="Susi"
            lastMessage="Qui robust, arabica half and half, et cultivar"
            date="12.03.2018 13:21"
          />
          <ChannelCard title="Channel 4" author="Peter" lastMessage="Lorem ipsum laber laber" date="12.03.2018 13:21" />
        </Col>
        <Col>Ipsum</Col>
      </Row>
    </Grid>
  );
}

interface ChannelCardProps {
  title: string;
  author: string;
  lastMessage: string;
  date: string;
  active?: boolean;
  unreadMessageCount?: number;
}
function ChannelCard({ title, active = false, author, lastMessage, date, unreadMessageCount }: ChannelCardProps) {
  const classnames = classNames(styles.ChannelCard, { [styles.active]: active });

  return (
    <Row className={classnames}>
      <Col>
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

          <div className={styles.lastMessageAbstract}>
            {author}: {lastMessage}
          </div>
        </div>
      </Col>
    </Row>
  );
}
