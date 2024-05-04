import React from "react";
import { Legend } from "models/chart";
import styles from "./legend.module.css";

interface IProps {
  legends: Legend[];
  hovered: string;
  onHover: (label: string) => void;
}

const isLegendHovered = (hovered: string, label: string): boolean => {
  if (hovered) {
    return hovered !== label;
  }
  return true;
};

export default function Legends({
  legends = [],
  hovered = "",
  onHover = () => null,
}: IProps) {
  return (
    <div className={styles.root}>
      {legends.map((legend) => {
        const isHovered = isLegendHovered(hovered, legend.label);
        return (
          <span
            key={legend.label}
            className={styles.label}
            onMouseOver={() => onHover(legend.label)}
            onMouseLeave={() => onHover("")}
          >
            <div
              className={`${styles.badge} ${!isHovered && "fadedBadge"}`}
              style={{
                backgroundColor:
                  hovered && hovered !== legend.label ? "#666" : legend.color,
              }}
            />
            <span className={styles.legendLabel}>{legend.label}</span>
          </span>
        );
      })}
    </div>
  );
}
