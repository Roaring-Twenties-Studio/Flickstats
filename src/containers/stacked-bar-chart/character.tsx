import React from "react";
import { ChartData } from "chart.js";
import Card from "components/card";
import StackedBarChart from "components/stacked-bar-chart";
import { getRandomColor } from "models/chart";
import { ParsedCharacter } from "models/screenplay";

interface IProps {
  pages: ParsedCharacter["pages"];
  labels: ParsedCharacter["labels"];
  category: "dialogs" | "action" | "scenes";
}

const formatData = (
  pages: ParsedCharacter["pages"],
  labels: ParsedCharacter["labels"],
  category: IProps["category"]
): ChartData<"bar"> => {
  const stackedLabels = labels[category];
  return {
    labels: [...Array(pages.length)].map((_, i) => i + 1),
    datasets: stackedLabels.map((label) => ({
      label,
      data: pages.map((page) => {
        const occurences = Object.entries(page[category]).find(
          ([k]) => k === label
        );
        return occurences ? occurences[1] : 0;
      }),
      backgroundColor: getRandomColor([]),
    })),
  };
};

export default function StackedBarChartCard({
  pages,
  labels,
  category,
}: IProps) {
  const formatedData = formatData(pages, labels, category);
  return (
    <Card>
      <StackedBarChart data={formatedData} />
    </Card>
  );
}
