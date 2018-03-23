import * as React from "react";

import Button from "../components/Button";

interface MessageEditorProps {
  onMessageChange(currentMessage: string): void;
  onNewMessage(newMessage: string): void;
}

interface MessageEditorState {
  newMessage: string;
}

export default class MessageEditor extends React.Component<MessageEditorProps, MessageEditorState> {
  readonly state: MessageEditorState = {
    newMessage: ""
  };

  onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.currentTarget.value;

    this.setState({ newMessage });
    this.props.onMessageChange(newMessage);
  };

  onSendClick = () => {
    const { newMessage } = this.state;
    const { onNewMessage } = this.props;

    onNewMessage(newMessage.trim());
    this.setState({ newMessage: "" });
  };

  render() {
    const { newMessage } = this.state;

    const lines = (newMessage.match(/\n/g) || []).length + 1;

    return (
      <React.Fragment>
        <textarea placeholder="Enter your message" value={newMessage} rows={lines} onChange={this.onMessageChange} />

        <Button disabled={newMessage.trim().length === 0} onClick={this.onSendClick}>
          Send
        </Button>
      </React.Fragment>
    );
  }
}
