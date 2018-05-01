

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PostNewMessageMutation
// ====================================================

export interface PostNewMessageMutationResult_postMessage_author {
  name: string;  // The readable name
  id: string;
}

export interface PostNewMessageMutationResult_postMessage {
  id: string;
  text: string;
  date: string;
  author: PostNewMessageMutationResult_postMessage_author;
}

export interface PostNewMessageMutationResult {
  postMessage: PostNewMessageMutationResult_postMessage;
}

export interface PostNewMessageMutationVariables {
  channelId: string;
  authorId: string;
  message: string;
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