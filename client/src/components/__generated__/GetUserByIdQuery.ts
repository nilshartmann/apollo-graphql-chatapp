

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserByIdQuery
// ====================================================

export interface GetUserByIdQuery_user {
  id: string;
  name: string;  // The readable name
}

export interface GetUserByIdQuery {
  user: GetUserByIdQuery_user | null;
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