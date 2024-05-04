import React, { useMemo } from "react";
import { ChartData } from "chart.js";
import Card from "components/card";
import VerticalBarChart from "components/charts/vertical-bar-chart";
import type { ParsedScreenplay } from "models/screenplay";
import { getRandomColor } from "utils/chart";

interface IProps {
  pages: ParsedScreenplay["pages"];
  category: "charactersDialogs" | "charactersActions";
  label: "actions" | "dialogs";
  customColor?: `#${string}`;
  penalties?: Record<string, number>;
}

const formatData = (
  pages: ParsedScreenplay["pages"],
  category: IProps["category"],
  customColor?: `#${string}`,
  penalties: Record<string, number> = {}
): ChartData<"bar"> => {
  const labels: string[] = [];
  const data: number[] = [];
  const totals: Record<string, number> = {};
  // create a 'totals' object with a value for each key. ex {joe: 44, john: 12}
  pages.forEach((page) =>
    Object.entries(page[category]).forEach(([key, value]) => {
      const penalty = penalties[key] || 0;
      key in totals ? (totals[key] += value) : (totals[key] = value - penalty);
    })
  );
  // sort the 'totals' object by value, and then push each key to labels, and its corresponding value to 'data'
  Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .forEach(([label, value]) => {
      labels.push(label);
      data.push(value);
    });
  const color = customColor || getRandomColor([]);
  return {
    labels,
    datasets: [
      {
        label: "Mentions",
        data,
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };
};

export default function VerticalBarChartCard({
  pages,
  category,
  label,
  customColor,
  penalties,
}: IProps) {
  const formatedData = useMemo(
    () => formatData(pages, category, customColor, penalties),
    [category, customColor, pages, penalties]
  );
  return (
    <Card>
      <VerticalBarChart data={formatedData} label={label} />
    </Card>
  );
}
