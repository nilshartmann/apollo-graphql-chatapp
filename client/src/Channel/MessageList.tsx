import { ChannelQueryResult_channel, ChannelQueryResult_channel_messages } from "./__generated__/ChannelQuery";
import * as React from "react";
import * as styles from "./Channel.scss";

type MessageListSnapshot = boolean;
interface MessageListProps {
  messages: Array<any>;
}
export default class MessageList extends React.Component<MessageListProps, {}, MessageListSnapshot> {
  messageListRef: HTMLDivElement | null = null;

  scrollToBottom = () => {
    if (!this.messageListRef) {
      return;
    }
    const scrollHeight = this.messageListRef.scrollHeight;
    const height = this.messageListRef.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageListRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  getSnapshotBeforeUpdate(prevProps: MessageListProps): MessageListSnapshot {
    const newMessageArrived = prevProps.messages.length !== this.props.messages.length;
    if (!newMessageArrived || !this.messageListRef) {
      // no new messages
      return false;
    }

    const messageListRef = this.messageListRef;

    const currentScrollTop = Math.floor(messageListRef.scrollTop);
    const scrollBottom = messageListRef.scrollHeight - messageListRef.clientHeight;
    const shouldScrollAtBottom = scrollBottom <= 0 || currentScrollTop === scrollBottom || currentScrollTop === scrollBottom - 1;
    return shouldScrollAtBottom;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(_: any, __: any, snapshot: MessageListSnapshot) {
    if (snapshot) {
      this.scrollToBottom();
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div className={styles.ChannelMessageList} ref={r => (this.messageListRef = r)}>
        {children}
      </div>
    );
  }
}
