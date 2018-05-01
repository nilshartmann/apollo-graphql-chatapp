

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchMessagesQuery
// ====================================================

export interface SearchMessagesQueryResult_searchMessages_pageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchMessagesQueryResult_searchMessages_edges_node_author {
  id: string;
  name: string;  // The readable name
}

export interface SearchMessagesQueryResult_searchMessages_edges_node {
  id: string;
  date: string;
  text: string;
  author: SearchMessagesQueryResult_searchMessages_edges_node_author;
}

export interface SearchMessagesQueryResult_searchMessages_edges {
  cursor: string;
  node: SearchMessagesQueryResult_searchMessages_edges_node;
}

export interface SearchMessagesQueryResult_searchMessages {
  pageInfo: SearchMessagesQueryResult_searchMessages_pageInfo;
  edges: SearchMessagesQueryResult_searchMessages_edges[];
}

export interface SearchMessagesQueryResult {
  searchMessages: SearchMessagesQueryResult_searchMessages;  // Searches for messsages that contain the specified search string  All channels **the current user belongs to** are searched. If there is no logged in user, nothing will be searched.
}

export interface SearchMessagesQueryVariables {
  searchString: string;
  after?: string | null;
}

//==============================================================
// START Enums and Input Objects
// All enums and input objects are included in every output file
// for now, but this will be changed soon.
// TODO: Link to issue to fix this.
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================