import React from "react";
import { ChartData } from "chart.js";
import PieChart from "components/charts/pie-chart";
import type { Legend } from "models/chart";
import type { ParsedCharacter } from "models/screenplay";
import { getRandomColor } from "utils/chart";
import styles from "./style.module.css";

interface IProps {
  pages: ParsedCharacter["pages"];
  labels: ParsedCharacter["labels"];
  category: "scenesIntExt" | "scenesPeriod";
  colorsPalette?: Record<string, `#${string}`>;
  penalties?: ParsedCharacter["penalties"];
}

const getPayload = (
  pages: ParsedCharacter["pages"],
  labels: ParsedCharacter["labels"],
  category: IProps["category"],
  colorsPalette?: Record<string, `#${string}`>,
  penalties: ParsedCharacter["penalties"] = {}
): { legends: Legend[]; data: ChartData<"pie"> } => {
  const pieLabels = labels[category];
  const colors: string[] = [];
  const legends: Legend[] = [];
  pieLabels.forEach((pieLabel) => {
    const color = colorsPalette
      ? colorsPalette[pieLabel]
      : getRandomColor(colors);
    legends.push({ label: pieLabel, color });
    colors.push(color);
  });

  const data = {
    labels: pieLabels,
    datasets: [
      {
        label: category,
        data: pieLabels.map((pieLabel) =>
          pages.reduce(
            (acc, page) => (acc += page[category][pieLabel]),
            penalties[pieLabel] || 0
          )
        ),
        hoverBackgroundColor: colors,
        borderColor: colors,
        backgroundColor: colors,
      },
    ],
  };
  return {
    legends,
    data,
  };
};

export default function PieChartCard({
  pages,
  labels,
  category,
  colorsPalette,
  penalties,
}: IProps) {
  const payload = getPayload(pages, labels, category, colorsPalette, penalties);
  return (
    <div className={styles.root}>
      <PieChart data={payload.data} legends={payload.legends} />
    </div>
  );
}
