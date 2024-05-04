import React from "react";
import Email from "components/icons/envelope.svg";
import Page from "components/icons/page.svg";
import Pen from "components/icons/pen.svg";
import Phone from "components/icons/phone.svg";
import styles from "./style.module.css";

interface IProps {
  text: string;
  icon: "email" | "phone" | "author" | "page";
}

const icons: Record<string, React.ReactNode> = {
  author: <Pen width={24} height={24} />,
  email: <Email width={24} height={24} />,
  page: <Page width={24} height={24} />,
  phone: <Phone width={24} height={24} />,
};

export default function Line({ text, icon }: IProps) {
  return (
    <div className={styles.line}>
      <div className={styles.badge}>{icons[icon]}</div>
      <p>{text || "Unknown"}</p>
    </div>
  );
}
