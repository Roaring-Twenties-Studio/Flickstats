import React from "react";
import styles from "./style.module.css";

interface IProps {
  title: string;
}

export default function ScripTitle({ title }: IProps) {
  return <div className={styles.title}>{title}</div>;
}
