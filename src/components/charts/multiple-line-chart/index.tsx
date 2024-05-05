import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Legends from "components/legends";
import { Legend, LineChartRef } from "models/chart";
import { updateLineChartColors } from "utils/chart";
import { getOptions } from "./options";
import styles from "./style.module.css";

interface IProps {
  data: ChartData<"line">;
  legends: Legend[];
  filterEmptyValues?: boolean;
  yCallback?: (value: number) => string;
  isPercentage?: boolean;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export default function MultipleLineChart({
  data,
  legends,
  filterEmptyValues,
  yCallback,
  isPercentage,
}: IProps) {
  const chartRef = useRef<LineChartRef>();
  const [hovered, setHovered] = useState("");
  const options = useMemo(
    () => getOptions(yCallback, filterEmptyValues, isPercentage),
    [yCallback, filterEmptyValues, isPercentage]
  );

  useEffect(() => {
    if (chartRef && chartRef.current) {
      updateLineChartColors(chartRef.current as LineChartRef, hovered);
      chartRef.current.update();
    }
  }, [hovered]);

  return data.labels.length > 0 ? (
    <>
      <Legends legends={legends} hovered={hovered} onHover={setHovered} />
      <Line
        options={options}
        data={data as ChartData<"line", number[], string>}
        // @ts-ignore this ref assignement is valid
        ref={(reference: LineChartRef) => (chartRef.current = reference)}
      />
    </>
  ) : (
    <p className={styles.noData}>No data detected</p>
  );
}
