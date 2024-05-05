import { Chart } from "chart.js";

export type Legend = {
  label: string;
  color: string;
};

export type LineChartRef = Chart<"line", number[], string>;
export type PieChartRef = Chart<"pie", number[], string>;
