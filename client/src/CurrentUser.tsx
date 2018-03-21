import * as React from "react";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";

const CURRENT_USER_CLIENT_QUERY = gql`
  query {
    currentUser @client {
      name
    }
  }
`;

interface CurrentUserProps {
  children: (currentUser: { id: string; name: string }) => React.ReactNode;
}
export default function CurrentUser({ children }: CurrentUserProps) {
  return (
    <Query query={CURRENT_USER_CLIENT_QUERY}>
      {function({ loading, error, data }) {
        const { currentUser } = data;
        return children(currentUser);
      }}
    </Query>
  );
}
