import { Chart } from "chart.js";

export function updateLineChartColors(
  chart: Chart<"line", number[], string>,
  hover: string
) {
  for (let i = 0; i < chart.data.datasets.length; i++) {
    const dataset = chart.data.datasets[i];
    if (hover) {
      if (dataset.label === hover) {
        dataset.backgroundColor = dataset.hoverBackgroundColor;
        dataset.borderColor = dataset.hoverBackgroundColor;
        dataset.order = 0;
      } else {
        dataset.backgroundColor = "#29292A";
        dataset.borderColor = "#29292A";
        dataset.order = 1;
      }
    } else {
      dataset.backgroundColor = dataset.hoverBackgroundColor;
      dataset.borderColor = dataset.hoverBackgroundColor;
      dataset.order = 1;
    }
  }
}

export function updateCircleChartColors(
  chart: Chart<"pie" | "doughnut", number[], string>,
  hover: string
) {
  for (let i = 0; i < chart.data.datasets.length; i++) {
    const labels = chart.data.labels || [];
    const dataset = chart.data.datasets[i];
    const hoveredColors = labels.map((label, i) => {
      if (label === hover) {
        // @ts-ignore hoveredBackgroundcolors is an array
        return dataset.hoverBackgroundColor[i];
      }
      return "#666";
    });
    if (hover) {
      dataset.backgroundColor = hoveredColors;
      dataset.borderColor = hoveredColors;
    } else {
      dataset.backgroundColor = dataset.hoverBackgroundColor;
      dataset.borderColor = dataset.hoverBackgroundColor;
    }
  }
}

const colors = [
  // blue
  "#00305C",
  "#7794b9",
  "#5199f5",
  "#056ef5",
  "#29476e",
  "#cbcae3",
  "#333085",
  // green
  "#c5e6d7",
  "#90caaf",
  "#33f59d",
  "#046338",
  "#374a41",
  "#80e8d8",
  "#c9d1d0",
  "#ccd4c3",
  // yellow
  "#f0f078",
  "#bdbd09",
  "#919121",
  "#5c5c33",
  //red
  "#e89b9b",
  "#e85f5f",
  "#e82525",
  "#6e2929",
  "#593737",
  "#ebdedd",
  // orange
  "#594b37",
  "#d1af7d",
  "#f2aa3f",
  "#ff9800",
  // pink
  "#e56fed",
  "#f2c1f5",
  "#7f4f82",
  "#e705f5",
  "#a6326e",
  "#e88080",
];

export function getRandomColor(existingColors: string[]): string {
  const newColor = colors[~~(Math.random() * colors.length)];
  if (existingColors.length >= colors.length) {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  if (existingColors.includes(newColor)) {
    return getRandomColor(existingColors);
  }
  return newColor;
  // return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
