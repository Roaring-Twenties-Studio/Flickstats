import React from "react";
import Camera from "components/icons/camera.svg";
import Clapperboard from "components/icons/clapperboard.svg";
import styles from "./counter.module.css";

interface IProps {
  count: number | string;
  legend: string;
  icon?: "camera" | "clapperboard";
}

const logo = {
  camera: <Camera width={62} height={62} />,
  clapperboard: <Clapperboard width={48} height={48} />,
};

export default function Counter({ count, legend, icon }: IProps) {
  return (
    <div className={styles.root}>
      <span className={styles.titleBlock}>
        {icon && logo[icon]}
        <span className={styles.title}>{count}</span>
      </span>
      <p>{legend}</p>
    </div>
  );
}
