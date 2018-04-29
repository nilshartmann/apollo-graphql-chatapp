import * as React from "react";
import * as styles from "./App.scss";

import { Route, Redirect, RouteProps } from "react-router-dom";

import { Grid, Row, Col } from "../layout/index";

import Header from "./Header";
import Footer from "./Footer";

import ChannelList from "../ChannelList";
import Channel from "../Channel";
import { clearLocalAuth, hasLocalUserId } from "../authService";
import Login from "../Login/Login";

const ProtectedRoute = ({ render, ...rest }: RouteProps) => (
  <Route
    {...rest}
    render={props =>
      hasLocalUserId() ? (
        render && render(props)
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default function App() {
  return (
    <React.Fragment>
      <Grid className={styles.AppFrame}>
        <Header />
        <Row className={styles.ChannelListRow}>
          <ProtectedRoute
            exact
            path="/channel/:currentChannelId?"
            render={routerProps => (
              <Col xs={4} className={styles.Main}>
                <ChannelList {...routerProps} />
              </Col>
            )}
          />

          <ProtectedRoute
            exact
            path="/channel/:currentChannelId"
            render={routerProps => (
              <Col>
                <Channel {...routerProps} />
              </Col>
            )}
          />
          <Route exact path="/" render={() => <Redirect to="/channel" />} />
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/logout"
            render={() => {
              clearLocalAuth();
              return <Redirect to="/" />;
            }}
          />
        </Row>

        <Footer />
      </Grid>
    </React.Fragment>
  );
}
