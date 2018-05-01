

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserByIdQuery
// ====================================================

export interface GetUserByIdQueryResult_user {
  id: string;
  name: string;  // The readable name
}

export interface GetUserByIdQueryResult {
  user: GetUserByIdQueryResult_user | null;  // The User with the specified id
}

export interface GetUserByIdQueryVariables {
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