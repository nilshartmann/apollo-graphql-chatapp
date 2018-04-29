import * as React from "react";
import * as styles from "./App.scss";

import { Grid, Row, Col } from "../layout/index";

const HOME = "https://github.com/nilshartmann/apollo-graphql-chatapp";

export default function Footer() {
  return (
    <Row className={styles.Footer} align="center">
      <Col>
        <h3>
          <a href={HOME} target="_blank">
            GraphQL Sample Application - {HOME}
          </a>
          &nbsp;|&nbsp;
          <a href="/logout">Logout</a>
        </h3>
      </Col>
    </Row>
  );
}
