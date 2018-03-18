

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChannelQuery
// ====================================================

export interface ChannelQuery_channel_messages_author {
  id: string;
  name: string;  // The readable name
}

export interface ChannelQuery_channel_messages {
  id: string;
  text: string;
  date: string;
  author: ChannelQuery_channel_messages_author;
}

export interface ChannelQuery_channel {
  id: string;
  title: string;
  messages: ChannelQuery_channel_messages[];
}

export interface ChannelQuery {
  channel: ChannelQuery_channel | null;
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