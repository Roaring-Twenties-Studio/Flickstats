import React, { useEffect, useRef, useState } from "react";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Title,
  Tooltip,
} from "chart.js";
import Legends from "components/legends";
import { Legend, PieChartRef, updateCircleChartColors } from "models/chart";
import { Pie } from "react-chartjs-2";
import { options } from "./options";
import styles from "./pie-chart.module.css";

interface IProps {
  data: ChartData<"pie">;
  legends: Legend[];
}

ChartJS.register(ArcElement, Title, Tooltip);

export default function PieChart({ data, legends }: IProps) {
  const chartRef = useRef<PieChartRef>();
  const [hovered, setHovered] = useState("");
  const hasData =
    data.datasets[0].data?.reduce((acc, cur) => (acc += cur), 0) > 0;

  useEffect(() => {
    if (chartRef && chartRef.current) {
      updateCircleChartColors(chartRef.current as PieChartRef, hovered);
      chartRef.current.update();
    }
  }, [hovered]);

  return hasData ? (
    <>
      <Legends legends={legends} hovered={hovered} onHover={setHovered} />
      <div className={styles.root}>
        <Pie
          options={options}
          data={data as ChartData<"pie", number[], string>}
          // @ts-ignore this ref assignement is valid
          ref={(reference: PieChartRef) => (chartRef.current = reference)}
        />
      </div>
    </>
  ) : (
    <p className={styles.noData}>No data detected</p>
  );
}
