import * as React from "react";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import { Row, Col } from "../layout";
import { MessageList } from "../Channel/MessageList";
import MessageView from "../Channel/MessageView";
import { Link, RouteComponentProps } from "react-router-dom";
import * as styles from "./User.scss";
import { GetUserInfoQueryResult, GetUserInfoQueryVariables } from "./__generated__/GetUserInfoQuery";
import GraphQLErrorViewer from "../components/GraphQLErrorViewer";
import Avatar from "../components/Avatar";

const GET_USER_INFO_QUERY = gql`
  query GetUserInfoQuery($userId: String!) {
    user(userId: $userId) {
      id
      name

      channels {
        id
        title
        owner {
          id
        }
      }

      messages {
        id
      }
    }
  }
`;
class UserQuery extends Query<GetUserInfoQueryResult, GetUserInfoQueryVariables> {}

interface UserProps extends RouteComponentProps<{ userId: string }> {}

export default class Search extends React.Component<UserProps> {
  render() {
    const userId = this.props.match.params.userId;

    return (
      <UserQuery query={GET_USER_INFO_QUERY} variables={{ userId }}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) {
            return <h1>Loading...</h1>;
          }

          if (error) {
            return <GraphQLErrorViewer error={error} />;
          }

          if (!data) {
            console.warn("Data is null in Search Component");
            return null;
          }

          const theUser = data.user;

          if (!theUser) {
            return <h1 className={styles.UserTitle}>Not found!</h1>;
          }

          return (
            <React.Fragment>
              <Row className={styles.UserTitle}>
                <Col>
                  <h1>{theUser.name}</h1>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Avatar className={styles.Avatar} userId={theUser.id} />
                  <p>User Id: {theUser.id}</p>
                  <p>{theUser.messages.length} Messages</p>
                </Col>

                <Col xs={4}>
                  <ul className={styles.Channels}>
                    {theUser.channels.map(channel => (
                      <Link key={channel.id} to={`/channel/${channel.id}`}>
                        <li className={styles.ChannelLink}>
                          {channel.title} {theUser.id === channel.owner.id && "(owner)"}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </Col>
              </Row>
            </React.Fragment>
          );
        }}
      </UserQuery>
    );
  }
}
