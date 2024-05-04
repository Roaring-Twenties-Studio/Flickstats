import React, { useMemo } from "react";
import { ParsedScreenplay } from "models/screenplay";
import styles from "./int-ext-text.module.css";

interface IProps {
  pages: ParsedScreenplay["pages"];
  penalties: ParsedScreenplay["penalties"];
}

export default function PeriodText({ pages, penalties = {} }: IProps) {
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
      return "NO DATA";
    }
    if (total.INT === total.EXT) {
      return "EQUAL";
    }
    if (total.INT > total.EXT) {
      return "INSIDE";
    }
    return "OUTSIDE";
  }, [pages, penalties.EXT, penalties.INT]);
  return mainPeriod === "EQUAL" ? (
    <div className={styles.root}>
      <p>
        There are as many <span className={styles.titleLight}>INDOOR </span>
        scenes as <span className={styles.titleLight}> OUTSIDE</span> scenes
      </p>
    </div>
  ) : mainPeriod === "INSIDE" ? (
    <div className={styles.root}>
      {" "}
      <p>Most scenes take place</p>
      <span className={styles.titleBlock}>
        <span className={styles.title}>INSIDE</span>
      </span>{" "}
    </div>
  ) : mainPeriod === "OUTSIDE" ? (
    <div className={styles.root}>
      {" "}
      <p>Most scenes take place</p>
      <span className={styles.titleBlock}>
        <span className={styles.title}>OUTSIDE</span>
      </span>
    </div>
  ) : (
    <div className={styles.root}>
      <p>No period detected</p>
    </div>
  );
}
