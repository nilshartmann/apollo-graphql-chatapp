import * as React from "react";

import { gql as clientGql } from "apollo-boost";
import { Query } from "react-apollo";

// use "clientGql" here as apollo codegen does not work
// with @client directive currently
// (https://github.com/apollographql/apollo-codegen/issues/366)
// as apollo codegen only looks for 'gql' tag,
// it ignores this query
const CURRENT_USER_CLIENT_QUERY = clientGql`
  query {
    currentUser @client {
      id
      name
    }

    draftMessages @client {
      id
      text
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
        console.log("DATA FROM CLIENT", data);
        return currentUser ? children(currentUser) : <div>fsdfas</div>;
      }}
    </Query>
  );
}
