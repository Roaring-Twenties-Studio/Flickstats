import React, { useMemo, useState } from "react";
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TitleIcon } from "components/title/light";
import Collapse from "components/icons/collapse.svg";
import Expand from "components/icons/expand.svg";
import { getOptions } from "./options";
import styles from "./horizontal-bar-chart.module.css";

interface IProps {
  data: ChartData<"bar">;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BAR_MIN_HEIGHT = 30;
const MAX_LABELS_FOR_SMALL_VIEW = 15;

export default function HorizontalBarChart({ data }: IProps) {
  const [zoom, setZoom] = useState(false);
  const options = useMemo(() => getOptions(zoom), [zoom]);
  const height =
    (zoom ? data?.labels?.length * BAR_MIN_HEIGHT : "auto") || "auto";
  const allowZoom = data?.labels?.length > MAX_LABELS_FOR_SMALL_VIEW;
  const icon = allowZoom ? (
    zoom ? (
      <Collapse width={12} height={12} />
    ) : (
      <Expand width={12} height={12} />
    )
  ) : null;
  return (
    <div style={{ height }}>
      {data.labels.length > 0 ? (
        <>
          {allowZoom && (
            <TitleIcon
              title="SORTED BY NUMBER OF SCENES"
              icon={icon}
              onClick={() => setZoom(!zoom)}
            />
          )}
          <Bar key={zoom.toString()} options={options} data={data} />
        </>
      ) : (
        <p className={styles.noData}>No data detected</p>
      )}
    </div>
  );
}
