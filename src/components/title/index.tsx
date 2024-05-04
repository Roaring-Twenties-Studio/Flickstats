import React, { ReactNode } from "react";
import styles from "./style.module.css";

interface IProps {
  title: string;
}

export default function Title({ title }: IProps) {
  return <h3 className={styles.root}>{title}</h3>;
}

export function TitleIcon({
  title,
  icon,
  onClick,
}: IProps & { icon: ReactNode; onClick: () => void }) {
  return (
    <h3 className={styles.rootIcon}>
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
  return <p className={styles.root}>{text}</p>;
}
