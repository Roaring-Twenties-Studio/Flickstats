import React, { useMemo } from "react";
import { ChartData } from "chart.js";
import Card from "components/card";
import StackedBarChart from "components/charts/stacked-bar-chart";
import type { ParsedScreenplay } from "models/screenplay";
import { getRandomColor } from "utils/chart";

interface IProps {
  pages: ParsedScreenplay["pages"];
  labels: ParsedScreenplay["labels"];
  category:
    | "charactersDialogs"
    | "charactersPresence"
    | "charactersAction"
    | "scenes";
}

const formatData = (
  pages: ParsedScreenplay["pages"],
  labels: ParsedScreenplay["labels"],
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
  const formatedData = useMemo(
    () => formatData(pages, labels, category),
    [category, labels, pages]
  );
  return (
    <Card>
      <StackedBarChart data={formatedData} />
    </Card>
  );
}
