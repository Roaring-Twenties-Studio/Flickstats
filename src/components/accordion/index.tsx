import React, { useRef, ReactNode } from "react";
import styles from "./accordion.module.css";

interface IProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClick: (id: number | undefined) => void;
  id: number;
}

export default function Accordion({
  title,
  isOpen,
  onClick,
  id,
  children,
}: IProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentHeight = isOpen ? contentRef?.current?.scrollHeight : 0;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.title} ${isOpen && styles.titleOpen}`}
        onClick={() => onClick(isOpen ? undefined : id)}
      >
        {title}
        <div
          className={`${styles.chevron} ${
            isOpen ? styles.chevronTop : styles.chevronBottom
          }`}
        />
      </div>
      <div
        className={styles.contentWrapper}
        style={{ maxHeight: contentHeight }}
      >
        <div className={styles.content} ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
