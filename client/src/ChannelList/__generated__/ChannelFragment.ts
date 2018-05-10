

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelFragment
// ====================================================

export interface ChannelFragmentResult_owner {
  id: string;
}

export interface ChannelFragmentResult_latestMessage_author {
  id: string;
  name: string;  // The readable name
}

export interface ChannelFragmentResult_latestMessage {
  id: string;
  date: string;
  author: ChannelFragmentResult_latestMessage_author;
  text: string;
}

export interface ChannelFragmentResult {
  id: string;                                    // Unique identifier
  title: string;                                 // Human-readable title of this Channel
  owner: ChannelFragmentResult_owner;                  // The Owner of this Channel. Only Owners can administer a Channel and add and remove users from it
  latestMessage: ChannelFragmentResult_latestMessage;  // The newest message that have been posted to this channel
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