import * as React from "react";
import * as styles from "./ThemeChooser.scss";
interface ThemeChooserProps {
  onThemeSelected(theme: string): void;
  themes: string[];
}
export default function ThemeChooser({ themes, onThemeSelected }: ThemeChooserProps) {
  return (
    <div className={styles.ThemeChooser}>
      {themes.map(t => (
        <div onClick={() => onThemeSelected(t)} key={t} className={`${t}-Icon`}>
          &nbsp;
        </div>
      ))}
    </div>
  );
}
