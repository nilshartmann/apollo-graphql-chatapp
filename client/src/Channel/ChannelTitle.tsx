import * as React from "react";
import { Row, Col } from "../layout";
import ArrowButton from "../components/ArrowButton";
import { ChannelQueryResult_channel } from "./__generated__/ChannelQuery";

import * as styles from "./Channel.scss";

interface ChannelTitleProps {
  channel: ChannelQueryResult_channel;
}

interface ChannelTitleState {
  expanded: boolean;
}

export default class ChannelTitle extends React.Component<ChannelTitleProps, ChannelTitleState> {
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
