import * as React from "react";
import * as styles from "./App.scss";

import { Grid, Row, Col } from "../layout/index";

import { CurrentUser } from "../components";
import Avatar from "../components/Avatar";

export default function Header() {
  return (
    <Row className={styles.Header} align="center">
      <Col>
        <h1>GraphQL Chat App</h1>
      </Col>
      <Col xs="auto">
        <CurrentUser>
          {({ id, name }) => (
            <div className={styles.UserDisplay}>
              <Avatar userId={id} />
              <h3>{name}</h3>
            </div>
          )}
        </CurrentUser>
      </Col>
    </Row>
  );
}
