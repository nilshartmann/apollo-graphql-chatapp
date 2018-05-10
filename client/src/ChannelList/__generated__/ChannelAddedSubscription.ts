

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: ChannelAddedSubscription
// ====================================================

export interface ChannelAddedSubscriptionResult_addedToChannel_owner {
  id: string;
}

export interface ChannelAddedSubscriptionResult_addedToChannel_latestMessage_author {
  id: string;
  name: string;  // The readable name
}

export interface ChannelAddedSubscriptionResult_addedToChannel_latestMessage {
  id: string;
  date: string;
  author: ChannelAddedSubscriptionResult_addedToChannel_latestMessage_author;
  text: string;
}

export interface ChannelAddedSubscriptionResult_addedToChannel {
  id: string;                                                            // Unique identifier
  title: string;                                                         // Human-readable title of this Channel
  owner: ChannelAddedSubscriptionResult_addedToChannel_owner;                  // The Owner of this Channel. Only Owners can administer a Channel and add and remove users from it
  latestMessage: ChannelAddedSubscriptionResult_addedToChannel_latestMessage;  // The newest message that have been posted to this channel
}

export interface ChannelAddedSubscriptionResult {
  addedToChannel: ChannelAddedSubscriptionResult_addedToChannel;
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