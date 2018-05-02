import * as React from "react";
import { SubscribeToMoreFnResult } from "../types";
import { ChannelQueryResult_channel } from "./__generated__/ChannelQuery";
import MessageList from "./MessageList";
import ChannelTitle from "./ChannelTitle";
import MessageView from "./MessageView";

interface ChannelMessageListProps {
  subscribeToNewMessages(): SubscribeToMoreFnResult;
  channel: ChannelQueryResult_channel;
}
export default class ChannelMessageList extends React.Component<ChannelMessageListProps> {
  unsubscribeFromNewMessages: SubscribeToMoreFnResult | null = null;
  componentDidMount() {
    this.unsubscribeFromNewMessages = this.props.subscribeToNewMessages();
  }

  componentWillUnmount() {
    this.unsubscribeFromNewMessages && this.unsubscribeFromNewMessages();
  }

  render() {
    const { channel } = this.props;
    return (
      <MessageList messages={this.props.channel.messages}>
        <ChannelTitle channel={channel} />
        {channel.messages.map(message => <MessageView key={message.id} message={message} />)}
      </MessageList>
    );
  }
}
