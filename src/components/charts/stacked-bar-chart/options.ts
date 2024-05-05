import { ChartOptions } from "chart.js";

export const options: ChartOptions<"bar"> = {
  indexAxis: "x" as const,
  resizeDelay: 1000,
  normalized: true,
  devicePixelRatio: undefined,
  elements: {
    bar: {
      borderWidth: 1,
      borderRadius: 12,
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
      text: "SCENES BY PAGE",
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
        title: (data) => "Page " + data[0].label,
      },
      filter: (item) => {
        return (item.dataset.data[item.dataIndex] as number) > 0;
      },
    },
  },
  scales: {
    y: {
      stacked: true,
      ticks: { color: "#fff", precision: 0 },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
    x: {
      stacked: true,
      ticks: { color: "#fff" },
      grid: { color: "rgba(0,0,0,0.1)" },
      title: {
        display: true,
        text: "pages",
      },
    },
  },
};
