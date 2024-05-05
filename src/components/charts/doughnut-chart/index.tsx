import React, { useEffect, useRef, useState } from "react";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Title,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Legends from "components/legends";
import type { Legend, PieChartRef } from "models/chart";
import { updateCircleChartColors } from "utils/chart";
import { options } from "./options";
import styles from "./style.module.css";

interface IProps {
  data: ChartData<"doughnut">;
  legends: Legend[];
}

ChartJS.register(ArcElement, Title, Tooltip);

export default function DoughnutChart({ data, legends }: IProps) {
  const chartRef = useRef<PieChartRef>();
  const [hovered, setHovered] = useState("");

  useEffect(() => {
    if (chartRef && chartRef.current) {
      updateCircleChartColors(chartRef.current as PieChartRef, hovered);
      chartRef.current.update();
    }
  }, [hovered]);
  return (
    <>
      <Legends legends={legends} hovered={hovered} onHover={setHovered} />
      <div className={styles.root}>
        <Doughnut
          options={options}
          data={data as ChartData<"doughnut", number[], string>}
          // @ts-ignore this ref assignement is valid
          ref={(reference: PieChartRef) => (chartRef.current = reference)}
        />
      </div>
    </>
  );
}
