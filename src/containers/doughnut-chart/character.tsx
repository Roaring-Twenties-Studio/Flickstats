import React from "react";
import { ChartData } from "chart.js";
import DoughnutChart from "components/doughnut-chart";
import Title from "components/title/light";
import { getRandomColor, Legend } from "models/chart";
import { ParsedCharacter } from "models/screenplay";
import styles from "./doughnut-chart-container.module.css";

interface IProps {
  pages: ParsedCharacter["pages"];
  labels: ParsedCharacter["labels"];
  category: "scenesIntExt" | "scenesPeriod";
  title: string;
  penalties?: Record<string, number>;
}

const getPayload = (
  pages: ParsedCharacter["pages"] | ParsedCharacter["pages"],
  labels: ParsedCharacter["labels"],
  category: IProps["category"],
  penalties: Record<string, number> = {}
): { legends: Legend[]; data: ChartData<"doughnut"> } => {
  const doughnutLabels = labels[category];
  const colors: string[] = [];
  const legends: Legend[] = [];
  doughnutLabels.forEach((doughnutLabel) => {
    const color = getRandomColor(colors);
    legends.push({ label: doughnutLabel, color });
    colors.push(color);
  });
  const data = {
    labels: doughnutLabels,
    datasets: [
      {
        label: category,
        data: doughnutLabels.map((doughnutLabel) => {
          return pages.reduce((acc, page) => {
            if (page[category][doughnutLabel]) {
              acc += page[category][doughnutLabel];
            }
            return acc;
          }, penalties[doughnutLabel] || 0);
        }),
        hoverBackgroundColor: colors,
        borderColor: colors,
        backgroundColor: colors,
      },
    ],
  };
  return { legends, data };
};

export default function DoughnutChartCard({
  pages,
  labels,
  category,
  title,
  penalties,
}: IProps) {
  const payload = getPayload(pages, labels, category, penalties);
  return (
    <>
      <Title title={title} />
      <div className={styles.root}>
        <DoughnutChart data={payload.data} legends={payload.legends} />
      </div>
    </>
  );
}
