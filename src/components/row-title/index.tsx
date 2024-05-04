import React from "react";
import styles from "./row-title.module.css";

interface IProps {
  title: string;
}

export default function ScripTitle({ title }: IProps) {
  return <div className={styles.title}>{title}</div>;
}
