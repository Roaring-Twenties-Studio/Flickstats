import React, { useMemo } from "react";
import { ChartData } from "chart.js";
import Card from "components/card";
import MultipleLineChart from "components/multiple-line-chart";
import { getRandomColor, Legend } from "models/chart";
import { ParsedScreenplay } from "models/screenplay";

interface IProps {
  pages: ParsedScreenplay["pages"];
  labels: ParsedScreenplay["labels"];
  xAxis: "pages" | "characters" | "scenes";
  yAxis:
    | "charactersDialogs"
    | "charactersActions"
    | "charactersPresence"
    | "scenes"
    | "dialogVSAction"
    | "scenesIntExt";
  filterEmptyValues?: boolean;
  title?: React.ReactNode;
  colorsPalette?: Record<string, `#${string}`>;
  yCallback?: (value: number) => string;
  isPercentage?: boolean;
}

const getPayload = (
  pages: ParsedScreenplay["pages"],
  labels: ParsedScreenplay["labels"],
  xAxis: IProps["xAxis"],
  yAxis: IProps["yAxis"],
  colorsPalette?: Record<string, `#${string}`>
): { legends: Legend[]; data: ChartData<"line"> } => {
  const xLabels = labels[xAxis];
  const yLabels = labels[yAxis];
  const legends: Legend[] = [];
  const colors: string[] = [];
  const data = {
    labels: xLabels,
    datasets: yLabels.map((yLabel) => {
      const color = colorsPalette
        ? colorsPalette[yLabel]
        : getRandomColor(colors);

      colors.push(color);
      legends.push({ label: yLabel, color });
      return {
        label: yLabel.toString(),
        pointStyle: "circle",
        data: pages.map((page) => page[yAxis][yLabel] || 0),
        hoverBackgroundColor: color,
        borderColor: color,
        backgroundColor: color,
        yAxisID: "y",
      };
    }),
  };
  return {
    legends,
    data,
  };
};

export default function MultipleLineChartCard({
  pages,
  labels,
  xAxis,
  yAxis,
  filterEmptyValues,
  title,
  yCallback,
  colorsPalette,
  isPercentage,
}: IProps) {
  const payload = useMemo(
    () => getPayload(pages, labels, xAxis, yAxis, colorsPalette),
    [colorsPalette, labels, pages, xAxis, yAxis]
  );

  return (
    <Card>
      {title && title}
      <MultipleLineChart
        legends={payload.legends}
        data={payload.data}
        yCallback={yCallback}
        filterEmptyValues={filterEmptyValues}
        isPercentage={isPercentage}
      />
    </Card>
  );
}
