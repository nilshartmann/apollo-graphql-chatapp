import * as React from "react";
import * as styles from "./App.scss";

import { Route, Redirect, RouteProps, RouteComponentProps } from "react-router-dom";

import { Grid, Row, Col } from "../layout/index";

import Header from "./Header";
import Footer from "./Footer";

import ChannelList from "../ChannelList";
import Channel from "../Channel";
import Search from "../Search";

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

interface ChatPageProps extends RouteComponentProps<void> {}
function ChatPage(props: ChatPageProps) {
  return (
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
    </Row>
  );
}

interface AppState {
  theme: string;
}
export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    theme: "DefaultTheme"
  };

  onThemeSelected = (theme: string) => {
    this.setState({ theme });
  };

  render() {
    const themeClass = styles[this.state.theme];

    return (
      <div className={themeClass}>
        <Grid className={styles.AppFrame}>
          <Header onThemeSelected={this.onThemeSelected} />

          <ProtectedRoute path="/channel" render={routerProps => <ChatPage {...routerProps} />} />
          <Route exact path="/" render={() => <Redirect to="/channel" />} />
          <ProtectedRoute
            exact
            path="/search"
            render={routerProps => (
              <Row className={styles.ChannelListRow}>
                <Col>
                  <Search {...routerProps} />
                </Col>
              </Row>
            )}
          />
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/logout"
            render={() => {
              clearLocalAuth();
              return <Redirect to="/" />;
            }}
          />

          <Footer />
        </Grid>
      </div>
    );
  }
}
