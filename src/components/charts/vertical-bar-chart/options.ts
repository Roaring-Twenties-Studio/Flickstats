import { ChartOptions, TooltipItem } from "chart.js";

export const getOptions = (
  type: "dialogs" | "actions"
): ChartOptions<"bar"> => ({
  indexAxis: "x" as const,
  resizeDelay: 1000,
  devicePixelRatio: undefined,
  normalized: true,
  layout: {
    padding: {
      right: 24,
    },
  },
  elements: {
    bar: {
      borderWidth: 1,
      borderRadius: 12,
      borderSkipped: "start",
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      font: {
        family: "interBold",
      },
      text: `SORTED BY NUMBER OF ${type.toUpperCase()}`,
      padding: {
        bottom: 24,
      },
    },
    tooltip: {
      usePointStyle: true,
      padding: 12,
      boxHeight: 6,
      titleMarginBottom: 10,
      bodySpacing: 8,
      mode: "index",
      callbacks: {
        label: (value: TooltipItem<"bar">) => {
          return `${value?.raw} ${
            Number(value?.raw) > 1 ? type : type.slice(0, -1)
          }`; // removes the "s"
        },
      },
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 1,
        color: "#fff",
        font: {
          size: 10,
        },
      },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
    x: {
      ticks: {
        color: "#fff",
        stepSize: 1,
        font: {
          size: 10,
        },
      },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
  },
});
