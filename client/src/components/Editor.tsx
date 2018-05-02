import * as React from "react";

import * as styles from "./Editor.scss";

import { Col, Row } from "../layout";
import Button from "../components/Button";

interface EditorProps {
  label: string;
  value: string;
  onValueChange(newValue: string): void;
  onSubmit(currentValue: string): void;
}

export default class Editor extends React.Component<EditorProps> {
  onInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13 && this.isValidValue()) {
      e.preventDefault();
      this.onSend();

      return false;
    }
  };

  isValidValue() {
    const { value } = this.props;

    return value.trim().length > 0;
  }

  onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.currentTarget.value;

    this.props.onValueChange(newMessage);
  };

  onSend = () => {
    let { onSubmit, value } = this.props;

    onSubmit(value);
  };

  render() {
    const { value, label } = this.props;
    const sendButtonDisabled = !this.isValidValue();

    return (
      <Row className={styles.Editor}>
        <Col className={styles.Form}>
          <input placeholder={label} value={value} onKeyPress={this.onInputKeyPress} onChange={this.onValueChange} />

          <Button disabled={sendButtonDisabled} onClick={this.onSend}>
            Send
          </Button>
        </Col>
      </Row>
    );
  }
}

interface UncontrolledEditorProps {
  label: string;
  onSubmit(currentValue: string): void;
}

interface UncontrolledEditorState {
  value: string;
}

export class UncontrolledEditor extends React.Component<UncontrolledEditorProps, UncontrolledEditorState> {
  readonly state = {
    value: ""
  };

  onValueChange = (newValue: string) => {
    this.setState({ value: newValue });
  };

  render() {
    const { label, onSubmit } = this.props;
    const { value } = this.state;

    return <Editor label={label} onSubmit={onSubmit} onValueChange={this.onValueChange} value={value} />;
  }
}
