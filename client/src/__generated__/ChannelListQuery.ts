

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChannelListQuery
// ====================================================

export interface ChannelListQuery_channels_latestMessage_author {
  id: string;
  name: string;  // The readable name
}

export interface ChannelListQuery_channels_latestMessage {
  id: string;
  date: string;
  author: ChannelListQuery_channels_latestMessage_author;
  text: string;
}

export interface ChannelListQuery_channels {
  id: string;
  title: string;
  latestMessage: ChannelListQuery_channels_latestMessage;
}

export interface ChannelListQuery {
  channels: ChannelListQuery_channels[];
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