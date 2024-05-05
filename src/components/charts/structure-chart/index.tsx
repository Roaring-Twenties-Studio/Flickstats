import React from "react";
import styles from "./style.module.css";

interface IProps {
  data: { width: string; color: string; label: string; legend: string }[];
}

export default function StructureChart({ data }: IProps) {
  return (
    <div className={styles.root}>
      {data.map((d, i) => (
        <div
          className={styles.actWrapper}
          key={`act_${d.label}`}
          style={{
            width: d.width,
            background: d.color,
            borderRadius: i === data.length - 1 ? "0 12px 12px 0" : "0",
          }}
        >
          <div className={styles.tooltip}>
            <div>{d.label}</div>
            <span>{d.legend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
