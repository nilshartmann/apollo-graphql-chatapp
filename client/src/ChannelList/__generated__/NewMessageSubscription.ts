

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: NewMessageSubscription
// ====================================================

export interface NewMessageSubscriptionResult_messageAdded_author {
  id: string;
  name: string;  // The readable name
}

export interface NewMessageSubscriptionResult_messageAdded_channel {
  id: string;  // Unique identifier
}

export interface NewMessageSubscriptionResult_messageAdded {
  id: string;
  date: string;
  text: string;
  author: NewMessageSubscriptionResult_messageAdded_author;
  channel: NewMessageSubscriptionResult_messageAdded_channel;
}

export interface NewMessageSubscriptionResult {
  messageAdded: NewMessageSubscriptionResult_messageAdded;
}

export interface NewMessageSubscriptionVariables {
  channelIds: string[];
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