import * as React from "react";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import { Row, Col } from "../layout";
import SearchForm from "./SearchForm";
import MessageList from "../Channel/MessageList";
import MessageView from "../Channel/MessageView";
import { SearchMessagesQueryResult, SearchMessagesQueryVariables } from "./__generated__/SearchMessagesQuery";
import Button from "../components/Button";
import { UncontrolledEditor } from "../components/Editor";
const SEARCH_MESSAGES_QUERY = gql`
  query SearchMessagesQuery($searchString: String!, $after: String) {
    searchMessages(searchString: $searchString, first: 10, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          date
          text
          author {
            id
            name
          }
          channel {
            id
            title
          }
        }
      }
    }
  }
`;

interface SearchState {
  searchString: string;
}
class SearchQuery extends Query<SearchMessagesQueryResult, SearchMessagesQueryVariables> {}

export default class Search extends React.Component<{}, SearchState> {
  readonly state: SearchState = {
    searchString: ""
  };

  setSearchString = (searchString: string) => {
    this.setState({
      searchString
    });
  };

  render() {
    const { searchString } = this.state;

    const skipQuery = !searchString;
    console.log("skipQuery: ", skipQuery);

    return (
      <React.Fragment>
        <UncontrolledEditor label="Enter Searchphrase" onSubmit={this.setSearchString} />
        <SearchQuery query={SEARCH_MESSAGES_QUERY} skip={skipQuery} variables={{ searchString }}>
          {({ loading, error, data, fetchMore }) => {
            if (skipQuery) {
              return null;
            }
            if (loading) {
              return <h1>Loading...</h1>;
            }

            if (error) {
              return <h1>Error :-</h1>;
            }

            if (!data) {
              console.warn("Data is null in Search Component");
              return null;
            }

            const { edges, pageInfo } = data.searchMessages;

            if (edges.length === 0) {
              return <h1>No messages found</h1>;
            }

            return (
              <React.Fragment>
                <MessageList messages={edges}>
                  {edges.map(e => <MessageView key={e.node.id} message={e.node} channel={e.node.channel} />)}
                </MessageList>
                {pageInfo.hasNextPage && (
                  <Button
                    onClick={() => {
                      fetchMore({
                        query: SEARCH_MESSAGES_QUERY,
                        variables: {
                          searchString,
                          after: edges[edges.length - 1].cursor
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return fetchMoreResult;
                        }
                      });
                    }}
                  >
                    More...
                  </Button>
                )}
              </React.Fragment>
            );
          }}
        </SearchQuery>
      </React.Fragment>
    );
  }
}
