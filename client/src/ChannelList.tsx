import * as React from "react";

import * as styles from "./ChannelList.scss";
import * as classNames from "classnames";

import { Row, Col } from "./layout";

export default function ChannelList() {
  return (
    <React.Fragment>
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
      <ChannelCard title="Channel 4" author="Peter" lastMessage="Lorem ipsum laber laber" date="12.03.2018 13:21" draft />
    </React.Fragment>
  );
}

interface ChannelCardProps {
  title: string;
  author: string;
  lastMessage: string;
  date: string;
  active?: boolean;
  unreadMessageCount?: number;
  draft?: boolean;
}
function ChannelCard({ title, active = false, author, lastMessage, date, unreadMessageCount, draft }: ChannelCardProps) {
  const classnames = classNames(styles.ChannelCard, { [styles.active]: active });

  return (
    <Row className={classnames}>
      <Col className={styles.Bla}>
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
            <div className={styles.lastMessageAbstractMessage}>
              {author}: {lastMessage}
            </div>
            <div className={styles.lastMessageAbstractDate}>{draft ? <span>(Draft)</span> : date}</div>
          </div>
        </div>
      </Col>
    </Row>
  );
}
