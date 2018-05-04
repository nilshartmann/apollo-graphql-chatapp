import * as React from "react";

import * as styles from "./Input.scss";

import { Col, Row } from "../layout";
import Button from "../components/Button";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputRef?: (ref: HTMLInputElement | null) => void;
}

export default class Input extends React.Component<InputProps> {
  render() {
    const { inputRef, ...rest } = this.props;

    return <input className={styles.Input} {...rest} ref={inputRef} />;
  }
}
