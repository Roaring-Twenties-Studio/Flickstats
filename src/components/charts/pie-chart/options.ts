import { ChartOptions, TooltipItem } from "chart.js";

export const options: ChartOptions<"pie"> = {
  maintainAspectRatio: true,
  normalized: true,
  resizeDelay: 1000,
  devicePixelRatio: undefined,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    title: {
      display: false,
    },
    tooltip: {
      usePointStyle: true,
      padding: 12,
      boxHeight: 6,
      titleMarginBottom: 10,
      bodySpacing: 8,
      mode: "index",
      callbacks: {
        title: (data) => `${data[0].label}.`,
        label: (data: TooltipItem<"pie">) =>
          `${data.formattedValue} scene${Number(data.raw) > 1 ? "s" : ""}`,
      },
    },
    legend: {
      display: false,
    },
  },
};
