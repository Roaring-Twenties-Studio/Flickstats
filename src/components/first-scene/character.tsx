import React from "react";
import styles from "./style.module.css";

interface IProps {
  scene: string;
}

export default function FirstCharacterScene({ scene }: IProps) {
  return scene ? (
    <div className={styles.root}>
      <p className={styles.title}>{scene}</p>
      is where we meet this character
    </div>
  ) : (
    <div className={styles.root}>
      <p className={styles.title}>No first scene detected</p>
    </div>
  );
}
