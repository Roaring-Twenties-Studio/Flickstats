import React, { useMemo } from "react";
import { ChartData } from "chart.js";
import Card from "components/card";
import HorizontalBarChart from "components/charts/horizontal-bar-chart";
import type { ParsedScreenplay } from "models/screenplay";
import { getRandomColor } from "utils/chart";

interface IProps {
  pages: ParsedScreenplay["pages"];
  category:
    | "charactersDialogs"
    | "charactersActions"
    | "charactersPresence"
    | "scenes";
  penalties: Record<string, number>;
  customColor?: `#${string}`;
}

const formatData = (
  pages: ParsedScreenplay["pages"],
  category: IProps["category"],
  penalties: Record<string, number>,
  customColor?: `#${string}`
): ChartData<"bar"> => {
  const labels: string[] = [];
  const data: number[] = [];
  const totals: Record<string, number> = {};
  // create a 'totals' object with a value for each key. ex {joe: 44, john: 12}
  pages.forEach((page) =>
    Object.entries(page[category]).forEach(([key, value]) =>
      key in totals ? (totals[key] += value) : (totals[key] = 1)
    )
  );
  if (penalties) {
    Object.entries(penalties).forEach(([scene, penalty]) => {
      if (scene in totals) {
        totals[scene] += penalty; // the penalty is a negative number, so += will substract the penalty from the total.
      }
    });
  }
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

export default function HorizontalBarChartCard({
  pages,
  category,
  penalties,
  customColor,
}: IProps) {
  const formatedData = useMemo(
    () => formatData(pages, category, penalties, customColor),
    [category, penalties, customColor, pages]
  );
  return (
    <Card>
      <HorizontalBarChart data={formatedData} />
    </Card>
  );
}
