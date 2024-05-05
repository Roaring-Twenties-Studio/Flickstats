import { ChartOptions, PointStyle } from "chart.js";

export const getOptions = (
  yCallback?: (value: number) => string,
  filterEmptyValues = true,
  isPercentage = false
): ChartOptions<"line"> => ({
  devicePixelRatio: undefined,
  responsive: true,
  normalized: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    tooltip: {
      usePointStyle: true,
      padding: 12,
      boxHeight: 6,
      titleMarginBottom: 10,
      bodySpacing: 8,
      mode: "index",
      backgroundColor: "#000",
      callbacks: {
        title: (data) => {
          if (data.length > 0) {
            return "Page " + data[0].label;
          }
          return "Page";
        },
        labelPointStyle: (point) => {
          if (filterEmptyValues) {
            return Number(point.raw) > 0
              ? {
                  pointStyle: point.dataset.pointStyle as PointStyle,
                  rotation: 6,
                }
              : null;
          } else {
            return {
              pointStyle: point.dataset.pointStyle as PointStyle,
              rotation: 6,
            };
          }
        },
        label: (label) => {
          if (filterEmptyValues) {
            return Number(label.raw) > 0
              ? `${label.dataset.label}: ${label.formattedValue}${
                  isPercentage ? "%" : ""
                }`
              : null;
          } else {
            return `${label.dataset.label}: ${label.formattedValue}${
              isPercentage ? "%" : ""
            }`;
          }
        },
      },
    },
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#fff",
        stepSize: 1,
        //@ts-ignore
        callback: (value: number) => (!!yCallback ? yCallback(value) : value),
      },
      title: {
        display: true,
        text: "Mentions",
        padding: {
          bottom: 12,
        },
      },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
    x: {
      ticks: {
        color: "#fff",
      },
      grid: { color: "rgba(0,0,0,0.1)" },
      title: {
        display: true,
        text: "pages",
      },
    },
  },
});
