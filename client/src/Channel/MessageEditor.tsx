import * as React from "react";

import Button from "../components/Button";

interface MessageEditorProps {
  message: string;
  onMessageChange(currentMessage: string): void;
  onNewMessage(newMessage: string): void;
}

export default class MessageEditor extends React.Component<MessageEditorProps> {
  onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.currentTarget.value;

    this.props.onMessageChange(newMessage);
  };

  onSendClick = () => {
    let { onNewMessage, message } = this.props;

    onNewMessage(message);
  };

  render() {
    const { message = "" } = this.props;

    const lines = (message.match(/\n/g) || []).length + 1;

    return (
      <React.Fragment>
        <input placeholder="Enter your message" value={message} onChange={this.onMessageChange} />

        <Button disabled={message.trim().length === 0} onClick={this.onSendClick}>
          Send
        </Button>
      </React.Fragment>
    );
  }
}
