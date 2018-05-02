import * as React from "react";

import * as styles from "./Editor.scss";

import { Col, Row } from "../layout";
import Button from "../components/Button";

interface EditorProps {
  label: string;
  value: string;
  focusOnMount?: boolean;
  onValueChange(newValue: string): void;
  onSubmit(currentValue: string): void;
}

export default class Editor extends React.Component<EditorProps> {
  private inputRef: HTMLInputElement | null = null;

  onInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13 && this.isValidValue()) {
      e.preventDefault();
      this.onSend();

      return false;
    }
  };

  setInputRef = (r: HTMLInputElement | null) => {
    this.inputRef = r;
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

  componentDidMount() {
    this.props.focusOnMount && this.inputRef && this.inputRef.focus();
  }

  render() {
    const { value, label } = this.props;
    const sendButtonDisabled = !this.isValidValue();

    return (
      <Row className={styles.Editor}>
        <Col className={styles.Form}>
          <input
            ref={this.setInputRef}
            placeholder={label}
            value={value}
            onKeyPress={this.onInputKeyPress}
            onChange={this.onValueChange}
          />

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
  initialValue?: string;
  focusOnMount?: boolean;
  onSubmit(currentValue: string): void;
}

interface UncontrolledEditorState {
  initialValue: string;
  value: string;
}

export class UncontrolledEditor extends React.Component<UncontrolledEditorProps, UncontrolledEditorState> {
  readonly state = {
    value: "",
    initialValue: ""
  };

  static getDerivedStateFromProps(nextProps: UncontrolledEditorProps, state: UncontrolledEditorState) {
    if (nextProps.initialValue !== state.initialValue) {
      return {
        value: nextProps.initialValue,
        initialValue: nextProps.initialValue
      };
    }
    return null;
  }

  onValueChange = (newValue: string) => {
    this.setState({ value: newValue });
  };

  render() {
    const { label, onSubmit, focusOnMount } = this.props;
    const { value } = this.state;

    return (
      <Editor label={label} focusOnMount={focusOnMount} onSubmit={onSubmit} onValueChange={this.onValueChange} value={value} />
    );
  }
}
