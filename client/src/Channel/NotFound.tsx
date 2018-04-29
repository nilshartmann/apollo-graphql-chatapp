import * as React from "react";
import { Col, Row } from "../layout";
import * as styles from "./Channel.scss";

export function NotFound() {
  return (
    <Row className={styles.Title}>
      <Col>
        <h1>Not Found</h1>
        <p>Channel not found</p>
      </Col>
    </Row>
  );
}
