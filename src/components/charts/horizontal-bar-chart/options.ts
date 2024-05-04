import { ChartOptions, TooltipItem } from "chart.js";

export const getOptions = (isZoomed: boolean): ChartOptions<"bar"> => ({
  indexAxis: "y" as const,
  resizeDelay: 1000,
  normalized: true,
  devicePixelRatio: undefined,
  maintainAspectRatio: isZoomed ? false : true, // this allows to set a height for each bar thanks to parent's minHeight
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
    tooltip: {
      usePointStyle: true,
      padding: 12,
      boxHeight: 6,
      titleMarginBottom: 10,
      bodySpacing: 8,
      mode: "index",
      callbacks: {
        label: (value: TooltipItem<"bar">) =>
          `${value?.raw} ${Number(value?.raw) > 1 ? "scenes" : "scene"}`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
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
