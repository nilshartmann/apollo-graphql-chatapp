import * as React from "react";
import * as ReactDOM from "react-dom";

import * as styles from "./App.scss";
import * as classNames from "classnames";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import { Grid, Row, Col } from "./layout";

import CurrentUser from "./CurrentUser";
import ChannelList from "./ChannelList";
import Channel from "./Channel";

import channels from "../../server/src/mocks/channels";
import { Switch, Route, Redirect } from "react-router-dom";
const HOME = "https://github.com/nilshartmann/apollo-graphql-chatapp";

const CURRENT_USER_CLIENT_QUERY = gql`
  query {
    currentUser @client {
      name
    }
  }
`;

export default function App() {
  return (
    <Grid className={styles.AppFrame} style={{}}>
      <Row className={styles.Header} align="center">
        <Col>
          <h1>GraphQL Chat App</h1>
        </Col>
        <Col xs="auto">
          <CurrentUser>{({ name }) => <h3>{name}</h3>}</CurrentUser>
        </Col>
      </Row>

      <Row className={styles.Main}>
        <Route
          exact
          path="/channel/:currentChannelId?"
          render={routerProps => (
            <Col xs={3} style={{ overflowY: "auto", height: "100%" }}>
              <ChannelList {...routerProps} />
            </Col>
          )}
        />
        <Route
          exact
          path="/channel/:currentChannelId"
          render={routerProps => (
            <Col style={{ overflowY: "auto", height: "100%" }}>
              <Channel {...routerProps} />
            </Col>
          )}
        />
        <Route exact path="/" render={() => <Redirect to="/channel" />} />
      </Row>

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
