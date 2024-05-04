import React, { useMemo } from "react";
import { ParsedCharacter } from "models/screenplay";
import styles from "./int-ext-text.module.css";

interface IProps {
  name: string;
  pages: ParsedCharacter["pages"];
  penalties: ParsedCharacter["penalties"];
}

export default function PeriodText({ name, pages, penalties = {} }: IProps) {
  const mainPeriod = useMemo(() => {
    const total = { INT: penalties.INT || 0, EXT: penalties.EXT || 0 };
    pages.forEach(({ scenesIntExt }) => {
      if (scenesIntExt) {
        return Object.entries(scenesIntExt).forEach(
          ([place, count]) => (total[place as "INT" | "EXT"] += count)
        );
      }
    });
    if (total.INT === 0 && total.EXT === 0) {
      return "NO_DATA";
    }
    if (total.INT === total.EXT) {
      return "EQUAL";
    }
    if (total.INT > 0 && total.EXT === 0) {
      return "ALL_INSIDE";
    }
    if (total.INT === 0 && total.EXT > 0) {
      return "ALL_OUTSIDE";
    }
    if (total.INT > total.EXT) {
      return "INSIDE";
    }
    return "OUTSIDE";
  }, [pages, penalties.EXT, penalties.INT]);
  return mainPeriod === "EQUAL" ? (
    <div className={styles.root}>
      <p>
        {name} appears as much{" "}
        <span className={styles.titleLight}>INSIDE </span>as
        <span className={styles.titleLight}> OUTSIDE</span>
      </p>
    </div>
  ) : mainPeriod === "ALL_INSIDE" || mainPeriod === "ALL_OUTSIDE" ? (
    <div className={styles.root}>
      <p>All {name}&apos; scenes take place</p>
      <span className={styles.titleBlock}>
        <span className={styles.title}>
          {mainPeriod === "ALL_INSIDE" ? "INSIDE" : "OUTSIDE"}
        </span>
      </span>
    </div>
  ) : mainPeriod === "NO_DATA" ? (
    <div className={styles.root}>
      <span className={styles.titleBlock}>No period detected</span>
    </div>
  ) : (
    <div className={styles.root}>
      <p>Most of {name}&apos; scenes take place</p>
      <span className={styles.titleBlock}>
        <span className={styles.title}>
          {mainPeriod === "INSIDE" ? "INSIDE" : "OUTSIDE"}
        </span>
      </span>
    </div>
  );
}
