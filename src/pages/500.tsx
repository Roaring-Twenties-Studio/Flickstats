import Button from "components/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "router/routes";
import styles from "styles/not-found.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className={styles.container}>
      <>
        <h3 className={styles.title}>PAGE NOT FOUND</h3>
        <p className={styles.text}>This page does not exist</p>
        <Button
          label="Return to the main page"
          onClick={() => navigate(routes.home)}
          variant="tertiary"
        />
      </>
    </section>
  );
}
