import React from "react";
import styles from "./style.module.css";

interface IProps {
  children: React.ReactNode;
}

export default function Card({ children }: IProps) {
  return <div className={styles.card}>{children}</div>;
}
