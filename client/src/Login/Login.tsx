import * as React from "react";
import { Row, Col } from "../layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { setLocalAuth } from "../authService";
import { RouteComponentProps } from "react-router";

import * as styles from "./Login.scss";

interface LoginProps extends RouteComponentProps<{}> {}

interface LoginState {
  username: string;
  password: string;
  error?: string | null;
}

export default class Login extends React.Component<LoginProps, LoginState> {
  usernameInputRef: HTMLInputElement | null = null;

  readonly state: LoginState = {
    username: "",
    password: ""
  };

  setUsernameInputRef = (ref: HTMLInputElement | null) => (this.usernameInputRef = ref);

  onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
      this.doLogin();
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name as any]: e.currentTarget.value });
  };

  doLogin = async () => {
    const { username, password } = this.state;

    this.setState({ error: null });

    const result = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "content-type": "application/json"
      }
    });

    const json = await result.json();

    if (!result.ok) {
      return this.setState({ error: json.error || result.statusText });
    }

    try {
      setLocalAuth(json.userId, json.token);
    } catch (e) {
      console.error("Could not setLocalAuth", e);
      this.setState({ error: "Technical problem while setting local authorization" });
    }

    // redirect
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    this.props.history.replace(from);
  };

  componentDidMount() {
    this.usernameInputRef && this.usernameInputRef.focus();
  }

  render() {
    const { username, password, error } = this.state;

    return (
      <div className={styles.Login}>
        <Col xs={6}>
          <div className={styles.Form}>
            <h1>Login</h1>
            <form>
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                type="text"
                name="username"
                inputRef={this.setUsernameInputRef}
                value={username}
                onChange={this.onInputChange}
                onKeyPress={this.onKeyPress}
              />

              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="text"
                name="password"
                value={password}
                onChange={this.onInputChange}
                onKeyPress={this.onKeyPress}
              />

              <Button type="button" onClick={this.doLogin}>
                Login
              </Button>

              {error && <div className={styles.Error}>Login failed: {error}</div>}
            </form>
          </div>
        </Col>
      </div>
    );
  }
}
