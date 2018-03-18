import * as React from "react";
import * as ReactDOM from "react-dom";

import * as styles from "./App.scss";
import * as classNames from "classnames";

import { Grid, Row, Col } from "./layout";

import ChannelList from "./ChannelList";
import Channel from "./Channel";

import channels from "../../server/src/mocks/channels";
import { Switch, Route, Redirect } from "react-router-dom";
const HOME = "https://github.com/nilshartmann/apollo-graphql-chatapp";

export default function App() {
  return (
    <Grid className={styles.AppFrame} style={{}}>
      <Row className={styles.Header} align="center">
        <Col>
          <h1>GraphQL Chat App</h1>
        </Col>
        <Col xs="auto">
          <h3>Klaus</h3>
        </Col>
      </Row>

      <Switch>
        <Route
          exact
          path="/channel/:currentChannelId"
          render={routerProps => (
            <Row className={styles.Main}>
              <Col xs={3} style={{ overflowY: "auto", height: "100%" }}>
                <ChannelList {...routerProps} />
              </Col>
              <Col style={{ overflowY: "auto", height: "100%" }}>
                <Channel title={channels[0].title} messages={channels[0].messages} {...routerProps} />
              </Col>
            </Row>
          )}
        />
        <Route path="/" render={() => <Redirect to="/channel/c1" />} />
      </Switch>

      <Row className={styles.Footer} align="center">
        <Col>
          <h3>
            <a href={HOME} target="_blank">
              {HOME}
            </a>
          </h3>
        </Col>
      </Row>
    </Grid>
  );
}
