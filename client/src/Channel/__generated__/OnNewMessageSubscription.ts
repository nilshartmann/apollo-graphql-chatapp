

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: OnNewMessageSubscription
// ====================================================

export interface OnNewMessageSubscriptionResult_messageAdded_author {
  id: string;
  name: string;  // The readable name
}

export interface OnNewMessageSubscriptionResult_messageAdded {
  id: string;
  text: string;
  date: string;
  author: OnNewMessageSubscriptionResult_messageAdded_author;
}

export interface OnNewMessageSubscriptionResult {
  messageAdded: OnNewMessageSubscriptionResult_messageAdded;
}

export interface OnNewMessageSubscriptionVariables {
  channelId: string;
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