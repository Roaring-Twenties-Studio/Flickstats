import React from "react";
import Loader from ".";
import styles from "./loader.module.css";

export default function FormLoader() {
  return (
    <div className={styles.formLoader}>
      <Loader />
    </div>
  );
}
