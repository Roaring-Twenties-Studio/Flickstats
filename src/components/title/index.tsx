import React from "react";
import styles from "./title.module.css";

interface IProps {
  title: string;
}

export default function Title({ title }: IProps) {
  return <h3 className={styles.root}>{title}</h3>;
}
