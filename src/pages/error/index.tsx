import React from "react";
import Button from "components/button";
import { routes } from "router/routes";
import styles from "./style.module.css";

export default function ErrorPage() {
  return (
    <div className={styles.root}>
      <h4 className={styles.title}>An error has occurred</h4>
      <Button
        onClick={() => window.location.assign(routes.home)}
        label="BACK TO THE DASHBOARD"
      />
    </div>
  );
}
