import React, { useMemo } from "react";
import Clock from "components/icons/clock.svg";
import type { ParsedCharacter } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  pages: ParsedCharacter["pages"];
  periods: ParsedCharacter["labels"]["scenesPeriod"];
  name: string;
  penalties: ParsedCharacter["penalties"];
}

export default function PeriodText({
  pages,
  periods,
  name,
  penalties = {},
}: IProps) {
  const mainPeriods = useMemo(() => {
    const total: Record<string, number> = {};
    periods.forEach((period) => (total[period] = penalties[period] || 0));
    pages.forEach(({ scenesPeriod }) => {
      if (scenesPeriod) {
        return Object.entries(scenesPeriod).forEach(
          ([period, count]) => (total[period] += count)
        );
      }
    });
    const sortedPeriods = Object.entries(total).sort((a, b) =>
      a[1] < b[1] ? 1 : -1
    );
    const topPeriods = [];
    sortedPeriods.some((period, i, self) => {
      if (i === 0) {
        topPeriods.push(period[0]);
        return false;
      }
      if (period[1] === self[i - 1][1]) {
        topPeriods.push(period[0]);
        return false;
      }
      return true;
    });
    return topPeriods;
  }, [pages, penalties, periods]);

  const label = new Intl.ListFormat("en-GB", {
    type: "conjunction",
  }).format(mainPeriods);
  const legend =
    mainPeriods.length > 1
      ? `are ${name}'s most common shooting times`
      : `is ${name}'s most common shooting time`;

  return (
    <div className={styles.root}>
      <span className={styles.titleBlock}>
        <Clock width={48} height={48} />
        <span className={styles.title}>{label}</span>
      </span>
      <p>{legend}</p>
    </div>
  );
}
