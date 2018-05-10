import * as React from "react";
import * as styles from "./ChannelManager.scss";

export default function ChannelManager() {
  return (
    <div className={styles.ChannelManager}>
      <h3>Add members</h3>
      {[1, 2, 3].map(i => (
        <div>
          <input key={i} type="checkbox" id={`user-checkbox-${i}`} />
          <label htmlFor={`user-checkbox-${i}`}>User {i}</label>
        </div>
      ))}
      <button>Add selected users</button>
    </div>
  );
}
