import React from "react";
import styles from "./characters-modal.module.css";

interface IProps {
  activeTab: "focus" | "exclude";
  onChangeTab: (value: "focus" | "exclude") => void;
  excludedCharactersTotal: number;
}

export default function Tabs({
  activeTab,
  excludedCharactersTotal,
  onChangeTab,
}: IProps) {
  return (
    <div className={styles.tabs}>
      <div
        className={`${styles.tab} ${
          activeTab === "focus" && styles.tabSelected
        }`}
        onClick={() => onChangeTab("focus")}
      >
        Focus
      </div>
      <div
        className={`${styles.tab} ${
          activeTab === "exclude" && styles.tabSelected
        }`}
        onClick={() => onChangeTab("exclude")}
      >
        Exclude
        <span
          className={`${styles.counter} ${
            activeTab === "exclude" && styles.counterSelected
          }`}
        >
          {excludedCharactersTotal}
        </span>
      </div>
    </div>
  );
}
