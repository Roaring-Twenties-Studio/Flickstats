import React from "react";
import CircleInfo from "components/icons/circle-info.svg";
import styles from "./style.module.css";

interface IProps {
  forceLineBreak: boolean;
  onChange: (forceLineBreak: boolean) => void;
}

export default function LineBreakOption({ onChange, forceLineBreak }: IProps) {
  return (
    <div className={styles.root}>
      <input
        type="checkbox"
        checked={forceLineBreak}
        name="char"
        id="forceLineBreak"
        onChange={() => onChange(!forceLineBreak)}
      />
      <label className={styles.optionLabel} htmlFor="forceLineBreak">
        force line break{" "}
        <span className={styles.infoCircle}>
          <div className={styles.tooltipLinebreak}>
            Sometimes PDF parsing can merge each page of text into a single
            line, making it difficult to analyze. Enabling the Force Line Breaks
            option ensures that the line breaks between each line are respected.
            Enable this option if your script analysis looks strange or
            incorrect. If it is already correct, leave it unchecked.
          </div>
          <CircleInfo width={12} height={12} />
        </span>
      </label>
    </div>
  );
}
