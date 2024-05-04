import React from "react";
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
import { options } from "./options";
import styles from "./style.module.css";

interface IProps {
  data: ChartData<"bar">;
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StackedBarChart({ data }: IProps) {
  return data.labels.length > 0 ? (
    <Bar options={options} data={data} />
  ) : (
    <p className={styles.noData}>No data detected</p>
  );
}
