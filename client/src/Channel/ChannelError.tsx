import * as React from "react";
import { Col, Row } from "../layout";
import * as styles from "./Channel.scss";
import { GraphQLError } from "graphql";

export default function ChannelError({ error }: { error: GraphQLError }) {
  return (
    <Row className={styles.Title}>
      <Col>
        <h1>Error</h1>
        <p>
          <pre>{JSON.stringify(error)}</pre>
        </p>
      </Col>
    </Row>
  );
}
