import * as React from "react";
import { Col, Row } from "../layout";
import * as styles from "./GraphQLErrorViewer.scss";
import { GraphQLError } from "graphql";

export default function GraphQLErrorViewer({ error }: { error: GraphQLError }) {
  return (
    <Row className={styles.GraphQLErrorViewer}>
      <Col>
        <h1>Error</h1>
        <textarea rows={15} value={JSON.stringify(error)} />
      </Col>
    </Row>
  );
}
