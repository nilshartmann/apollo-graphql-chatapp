import * as React from "react";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { GetUserByIdQuery, GetUserByIdQueryVariables } from "./__generated__/GetUserByIdQuery";
import { getLocalUserId } from "../authService";

const CURRENT_USER_QUERY = gql`
  query GetUserByIdQuery($userId: String!) {
    user(userId: $userId) {
      id
      name
    }
  }
`;

interface CurrentUserProps {
  children: (currentUser: { id: string; name: string }) => React.ReactNode;
}

class CurrentUserQuery extends Query<GetUserByIdQuery, GetUserByIdQueryVariables> {}

export default function CurrentUser({ children }: CurrentUserProps) {
  const currentUserId = getLocalUserId();

  return (
    <CurrentUserQuery skip={!currentUserId} query={CURRENT_USER_QUERY} variables={{ userId: currentUserId || "" }}>
      {({ loading, error, data }) => {
        if (loading || error || !data || !data.user) {
          return null;
        }
        const { user } = data;
        return children(user);
      }}
    </CurrentUserQuery>
  );
}
