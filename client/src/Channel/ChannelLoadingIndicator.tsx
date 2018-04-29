import * as React from "react";
import { Col, Row } from "../layout";
import * as styles from "./Channel.scss";

export default function ChannelLoadingIndicator() {
  return (
    <Row className={styles.Title}>
      <Col>
        <h1>Loading Data...</h1>
      </Col>
    </Row>
  );
}
