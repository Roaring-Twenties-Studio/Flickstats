import React from "react";
import Button from "components/button";
import Loader from "components/loader";
import styles from "./style.module.css";

interface IProps {
  children: React.ReactNode;
  loading: boolean;
  error: string;
  onReset?: () => void;
}

export default function DataWrapper({
  children,
  loading,
  error,
  onReset,
}: IProps) {
  return (
    <div>
      {loading ? (
        <div className={styles.centerer}>
          <div className={styles.loading}>
            <Loader />
          </div>
        </div>
      ) : error ? (
        <div className={styles.errorCenterer}>
          <p className={styles.error}>{error}</p>
          {!!onReset && (
            <Button onClick={onReset} label="Try again" variant="secondary" />
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
