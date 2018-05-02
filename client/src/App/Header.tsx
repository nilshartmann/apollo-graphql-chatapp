import * as React from "react";
import * as styles from "./App.scss";
import { withRouter } from "react-router-dom";
import * as qs from "query-string";
import { Grid, Row, Col } from "../layout/index";

import { CurrentUser } from "../components";
import { Link, RouteComponentProps } from "react-router-dom";
import Avatar from "../components/Avatar";

interface HeaderProps extends RouteComponentProps<void> {}

function Header({ history }: HeaderProps) {
  let searchInput: HTMLInputElement | null = null;

  const onSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchInput) {
      return;
    }

    const searchValue = e.currentTarget.value.trim();

    if (e.charCode === 13 && searchValue) {
      e.preventDefault();
      e.currentTarget.value = "";
      const s = qs.stringify({ query: searchValue });
      history.push(`/search?${s}`);
      return false;
    }
  };

  return (
    <Row className={styles.Header} align="center">
      <Col>
        <Link to="/">
          <h1>GraphQL Chat App</h1>
        </Link>
      </Col>
      <Col xs={4}>
        <input
          ref={r => (searchInput = r)}
          style={{ width: "100%" }}
          type="text"
          placeholder="Search"
          onKeyPress={onSearchKeyPress}
        />
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

export default withRouter(Header);
