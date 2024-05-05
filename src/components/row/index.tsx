import React from "react";
import styles from "./style.module.css";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  layout?: "main-right" | "main-left" | "auto";
}

export default function Row({ children, layout = "auto" }: IProps) {
  return <div className={`${styles[layout]}`}>{children}</div>;
}
