import React from "react";
import Dialog from "components/icons/dialog.svg";
import type { ParsedCharacter } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  pages: ParsedCharacter["pages"];
  penalties: ParsedCharacter["characterDialogsPenalties"];
  name: string;
}

export default function DialogCount({
  pages,
  name = "",
  penalties = {},
}: IProps) {
  const total = pages.reduce(
    (acc, cur) => (acc += cur.dialogs[name]),
    penalties[name] || 0
  );
  return (
    <div className={styles.root}>
      <span className={styles.titleBlock}>
        <Dialog width={62} height={62} />
        <span className={styles.title}>{total}</span>
      </span>
      <p className={styles.legend}>
        dialog{total === 1 ? "" : "s"} in the script
      </p>
      <p className={styles.info}>*cont&apos;d are not counted as new dialogs</p>
    </div>
  );
}
