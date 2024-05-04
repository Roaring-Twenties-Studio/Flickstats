import React from "react";
import styles from "./style.module.css";

interface IProps {
  label: string;
  min: number;
  max: number;
  value: number;
  color: "blue" | "orange" | "red";
  onChange: (value: number) => void;
  onFocus: () => void;
}

export default function InputRange({
  min,
  max,
  value,
  label,
  color,
  onChange,
  onFocus,
}: IProps) {
  return (
    <div className={styles.root}>
      <label htmlFor={label}>
        {label} ({value}px)
      </label>
      <input
        className={`${styles[color]}`}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        type="range"
        id={label}
        name={label}
        value={value}
        min={min}
        max={max}
        onFocus={onFocus}
      />
    </div>
  );
}
