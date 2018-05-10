import * as React from "react";
import * as qs from "query-string";

import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import { Row, Col } from "../layout";
import SearchForm from "./SearchForm";
import { MessageList } from "../Channel/MessageList";
import MessageView from "../Channel/MessageView";
import { SearchMessagesQueryResult, SearchMessagesQueryVariables } from "./__generated__/SearchMessagesQuery";
import Button from "../components/Button";
import { UncontrolledEditor } from "../components/Editor";
import { RouteComponentProps } from "react-router";
import * as styles from "./Search.scss";

const SEARCH_MESSAGES_QUERY = gql`
  query SearchMessagesQuery($searchString: String!, $after: String) {
    searchMessages(searchString: $searchString, first: 7, after: $after) {
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
class SearchQuery extends Query<SearchMessagesQueryResult, SearchMessagesQueryVariables> {}

interface SearchState {
  searchString: string;
}

interface SearchProps extends RouteComponentProps<void> {}

export default class Search extends React.Component<SearchProps, SearchState> {
  readonly state: SearchState = {
    searchString: ""
  };

  static getDerivedStateFromProps(nextProps: SearchProps) {
    const parsed = qs.parse(nextProps.location.search);
    if (parsed && parsed.query) {
      return { searchString: parsed.query };
    }

    return null;
  }

  setSearchString = (searchString: string) => {
    this.setState({
      searchString
    });
  };

  render() {
    const { searchString } = this.state;

    const skipQuery = !searchString;

    return (
      <React.Fragment>
        <UncontrolledEditor
          label="Enter Searchphrase"
          buttonLabel="Search"
          focusOnMount={true}
          onSubmit={this.setSearchString}
          initialValue={searchString}
        />
        <SearchQuery query={SEARCH_MESSAGES_QUERY} skip={skipQuery} fetchPolicy="network-only" variables={{ searchString }}>
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

            // height: calc(100vh - 17rem);
            return (
              <div>
                <h1 className={styles.SearchResultTitle}>
                  Messages containing <b>{searchString}</b>:
                </h1>

                <MessageList messages={edges} className={styles.SearchList}>
                  {edges.map(e => <MessageView key={e.node.id} message={e.node} channel={e.node.channel} />)}
                  {pageInfo.hasNextPage && (
                    <div
                      className={styles.LoadMore}
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
                      Load more...
                    </div>
                  )}
                </MessageList>
              </div>
            );
          }}
        </SearchQuery>
      </React.Fragment>
    );
  }
}
