import { ChannelQueryResult_channel } from "./__generated__/ChannelQuery";
import * as React from "react";
import * as styles from "./Channel.scss";
import ChannelTitle from "./ChannelTitle";
import { SubscribeToMoreFnResult } from "../types";
import MessageView from "./MessageView";
interface MessagesListProps {
  subscribeToNewMessages(): SubscribeToMoreFnResult;
  channel: ChannelQueryResult_channel;
}

export default class MessageList extends React.Component<MessagesListProps> {
  unsubscribeFromNewMessages: SubscribeToMoreFnResult | null = null;
  messageListRef: HTMLDivElement | null = null;
  scrollAtBottom: boolean = true;

  scrollToBottom = () => {
    if (!this.messageListRef) {
      return;
    }
    const scrollHeight = this.messageListRef.scrollHeight;
    const height = this.messageListRef.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageListRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  componentWillUpdate(nextProps: MessagesListProps) {
    const newMessageArrived = nextProps.channel.messages.length !== this.props.channel.messages.length;
    if (!newMessageArrived || !this.messageListRef) {
      return;
    }
    const scrollPos = this.messageListRef.scrollTop;
    const scrollBottom = this.messageListRef.scrollHeight - this.messageListRef.clientHeight;
    this.scrollAtBottom = scrollBottom <= 0 || scrollPos === scrollBottom;
  }

  componentDidMount() {
    this.unsubscribeFromNewMessages = this.props.subscribeToNewMessages();
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.unsubscribeFromNewMessages && this.unsubscribeFromNewMessages();
  }

  componentDidUpdate() {
    if (this.scrollAtBottom) {
      this.scrollToBottom();
    }
  }

  render() {
    const { channel } = this.props;
    return (
      <div className={styles.MessagesList} ref={r => (this.messageListRef = r)}>
        <ChannelTitle channel={channel} />

        {channel.messages.map(message => <MessageView key={message.id} message={message} />)}
      </div>
    );
  }
}
