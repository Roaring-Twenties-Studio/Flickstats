import React from "react";
import Button from "components/button";
import styles from "./form-error.module.css";

interface IProps {
  onReset: () => void;
  error: string;
}

export default function FormError({ onReset, error }: IProps) {
  return (
    <div className={styles.root}>
      <p>{error}</p>
      <Button variant="danger" label="Try again" onClick={onReset} />
    </div>
  );
}
