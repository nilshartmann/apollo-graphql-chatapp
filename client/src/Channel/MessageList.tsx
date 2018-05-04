import { ChannelQueryResult_channel, ChannelQueryResult_channel_messages } from "./__generated__/ChannelQuery";
import * as React from "react";
import * as styles from "./Channel.scss";

type AutoScrollMessageListSnapshot = boolean;
interface AutoScrollMessageListProps {
  className?: string;
  messages: Array<any>;
}
export default class AutoScrollMessageList extends React.Component<
  AutoScrollMessageListProps,
  {},
  AutoScrollMessageListSnapshot
> {
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

  getSnapshotBeforeUpdate(prevProps: AutoScrollMessageListProps): AutoScrollMessageListSnapshot {
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

  componentDidUpdate(_: any, __: any, snapshot: AutoScrollMessageListSnapshot) {
    if (snapshot) {
      this.scrollToBottom();
    }
  }

  render() {
    const { children, className = "" } = this.props;

    const effectiveClassName = `${styles.ChannelMessageList} ${className}`;

    return (
      <div className={effectiveClassName} ref={r => (this.messageListRef = r)}>
        {children}
      </div>
    );
  }
}

interface MessageListProps extends AutoScrollMessageListProps {
  children: React.ReactNode;
}
export function MessageList({ messages, className = "", children }: MessageListProps) {
  const effectiveClassName = `${styles.ChannelMessageList} ${className}`;
  return <div className={effectiveClassName}>{children}</div>;
}
