import React from "react";
import styles from "./style.module.css";

interface IProps {
  label?: string;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary" | "danger";
  onClick: () => void;
  type?: "submit" | "button" | "reset";
}

export default function Button({
  label,
  icon,
  isDisabled,
  variant = "primary",
  onClick,
  type,
}: IProps) {
  return (
    <button
      className={`${styles.root} ${styles[variant]}`}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
}
