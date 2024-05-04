import React, { ReactNode } from "react";
import styles from "./title.module.css";

interface IProps {
  title: string;
}

export default function TitleLight({ title }: IProps) {
  return <h3 className={styles.light}>{title}</h3>;
}

export function TitleIcon({
  title,
  icon,
  onClick,
}: IProps & { icon: ReactNode; onClick: () => void }) {
  return (
    <h3 className={styles.lightIcon}>
      {title}
      {icon && (
        <span className={styles.icon} onClick={onClick}>
          {icon}
        </span>
      )}
    </h3>
  );
}

export function Text({ text }: { text: string }) {
  return <p className={styles.light}>{text}</p>;
}
