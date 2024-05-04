import React from "react";
import { ChartData } from "chart.js";
import Card from "components/card";
import HorizontalBarChart from "components/horizontal-bar-chart";
import { getRandomColor } from "models/chart";
import { ParsedScreenplay } from "models/screenplay";

interface IProps {
  scenes: ParsedScreenplay["characterScenes"];
  customColor?: `#${string}`;
}

const formatData = (
  scenes: ParsedScreenplay["characterScenes"],
  customColor?: `#${string}`
): ChartData<"bar"> => {
  const labels: string[] = [];
  const data: number[] = [];

  // sort the 'totals' object by value, and then push each key to labels, and its corresponding value to 'data'
  Object.entries(scenes)
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

export default function CharacterScenes({ scenes, customColor }: IProps) {
  const formatedData = formatData(scenes, customColor);
  return (
    <Card>
      <HorizontalBarChart data={formatedData} />
    </Card>
  );
}
