import React from "react";
import Counter from "components/counter";
import type { ParsedScreenplay } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  pages: ParsedScreenplay["pages"];
}

export default function Percentages({ pages }: IProps) {
  const dialogTotal = pages.reduce(
    (acc, page) => (acc += page.dialogVSAction.dialog),
    0
  );
  const actionTotal = pages.reduce(
    (acc, page) => (acc += page.dialogVSAction.action),
    0
  );
  const total = dialogTotal + actionTotal;
  const dialogPercentage =
    total === 0 ? "0%" : `${((dialogTotal * 100) / total).toFixed(1)}%`;
  const actionPercentage =
    total === 0 ? "0%" : `${((actionTotal * 100) / total).toFixed(1)}%`;
  return (
    <div className={styles.root}>
      <Counter count={dialogPercentage} legend="speaking" />
      <Counter count={actionPercentage} legend="doing something" />
    </div>
  );
}
