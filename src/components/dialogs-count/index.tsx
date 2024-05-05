import React from "react";
import Dialog from "components/icons/dialog.svg";
import type { ParsedScreenplay } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  pages: ParsedScreenplay["pages"];
  penalties: ParsedScreenplay["charactersDialogsPenalties"];
}

export default function DialogCount({ pages, penalties = {} }: IProps) {
  const penaltiesTotal = Object.values(penalties).reduce(
    (acc, cur) => (acc += cur),
    0
  );
  const total = pages.reduce(
    (acc, page) =>
      (acc += Object.values(page.charactersDialogs).reduce(
        (pageTotal, value) => (pageTotal += value),
        0
      )),
    -penaltiesTotal || 0
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
