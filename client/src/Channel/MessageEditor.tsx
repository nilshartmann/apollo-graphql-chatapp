import * as React from "react";

import Button from "../components/Button";

interface MessageEditorProps {
  onNewMessage(newMessage: string): void;
}

interface MessageEditorState {
  newMessage: string;
}

export default class MessageEditor extends React.Component<MessageEditorProps, MessageEditorState> {
  readonly state: MessageEditorState = {
    newMessage: ""
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
        <textarea
          placeholder="Enter your message"
          value={newMessage}
          rows={lines}
          onChange={e => this.setState({ newMessage: e.currentTarget.value })}
        />

        <Button disabled={newMessage.trim().length === 0} onClick={this.onSendClick}>
          Send
        </Button>
      </React.Fragment>
    );
  }
}
