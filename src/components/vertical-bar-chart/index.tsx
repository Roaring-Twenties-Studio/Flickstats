import React, { useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getOptions } from "./options";
import styles from "./vertical-bar-chart.module.css";

interface IProps {
  data: ChartData<"bar">;
  label: "actions" | "dialogs";
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function VerticalBarChart({ data, label }: IProps) {
  const options = useMemo(() => getOptions(label), [label]);
  return data.labels.length > 0 ? (
    <Bar options={options} data={data} />
  ) : (
    <p className={styles.noData}>No data detected</p>
  );
}
