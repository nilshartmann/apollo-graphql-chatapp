import * as React from "react";

import Button from "../components/Button";

interface MessageEditorProps {
  message: string;
  onMessageChange(currentMessage: string): void;
  onNewMessage(newMessage: string): void;
}

export default class MessageEditor extends React.Component<MessageEditorProps> {
  onMessageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13 && this.isValidMessage()) {
      e.preventDefault();
      this.onSend();

      return false;
    }
  };

  isValidMessage() {
    const { message } = this.props;

    return message.trim().length > 0;
  }

  onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.currentTarget.value;

    this.props.onMessageChange(newMessage);
  };

  onSend = () => {
    let { onNewMessage, message } = this.props;

    onNewMessage(message);
  };

  render() {
    const { message } = this.props;
    const sendButtonDisabled = !this.isValidMessage();

    return (
      <React.Fragment>
        <input
          placeholder="Enter your message"
          value={message}
          onKeyPress={this.onMessageKeyPress}
          onChange={this.onMessageChange}
        />

        <Button disabled={sendButtonDisabled} onClick={this.onSend}>
          Send
        </Button>
      </React.Fragment>
    );
  }
}
