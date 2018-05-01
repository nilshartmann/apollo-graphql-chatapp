

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChannelQuery
// ====================================================

export interface ChannelQueryResult_channel_members {
  id: string;
  name: string;  // The readable name
}

export interface ChannelQueryResult_channel_messages_author {
  id: string;
  name: string;  // The readable name
}

export interface ChannelQueryResult_channel_messages {
  id: string;
  text: string;
  date: string;
  author: ChannelQueryResult_channel_messages_author;
}

export interface ChannelQueryResult_channel {
  id: string;     // Unique identifier
  title: string;  // Human-readable title of this Channel
  members: ChannelQueryResult_channel_members[];
  messages: ChannelQueryResult_channel_messages[];
}

export interface ChannelQueryResult {
  channel: ChannelQueryResult_channel | null;
}

export interface ChannelQueryVariables {
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