

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserInfoQuery
// ====================================================

export interface GetUserInfoQueryResult_user_channels_owner {
  id: string;
}

export interface GetUserInfoQueryResult_user_channels {
  id: string;                                   // Unique identifier
  title: string;                                // Human-readable title of this Channel
  owner: GetUserInfoQueryResult_user_channels_owner;  // The Owner of this Channel. Only Owners can administer a Channel and add and remove users from it
}

export interface GetUserInfoQueryResult_user_messages {
  id: string;
}

export interface GetUserInfoQueryResult_user {
  id: string;
  name: string;  // The readable name
  channels: GetUserInfoQueryResult_user_channels[];
  messages: GetUserInfoQueryResult_user_messages[];
}

export interface GetUserInfoQueryResult {
  user: GetUserInfoQueryResult_user | null;  // The User with the specified id
}

export interface GetUserInfoQueryVariables {
  userId: string;
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