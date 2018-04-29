import * as React from "react";
import * as styles from "./ArrowButton.scss";

const Icons = {
  up: require("./assets/Arrow_Up.svg"),
  down: require("./assets/Arrow_Down.svg")
};

interface ArrowButtonProps extends React.ImgHTMLAttributes<{}> {
  onClick: () => void;
  direction: "up" | "down";
}

export default function ArrowButton({ direction, onClick, ...attributes }: ArrowButtonProps) {
  return (
    <div className={styles.ArrowButton}>
      <img src={Icons[direction]} onClick={onClick} {...attributes} />
    </div>
  );
}
