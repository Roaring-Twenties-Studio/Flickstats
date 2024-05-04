import React from "react";
import Quote from "components/quote";
import type { ParsedScreenplay } from "models/screenplay";
import Line from "./line";
import styles from "./style.module.css";

interface IProps {
  metadata: ParsedScreenplay["metadata"];
  actionQuote: ParsedScreenplay["actionQuote"];
}

export default function Infos({ metadata, actionQuote }: IProps) {
  const pagesLabel = metadata.pages === 1 ? "page" : "pages";
  return (
    <section className={styles.root}>
      <div className={styles.infoRoot}>
        <div className={styles.block}>
          <Line text={metadata.email} icon="email" />
          <Line text={metadata.writtenBy} icon="author" />
          <Line text={metadata.phone} icon="phone" />
          <Line text={`${metadata.pages} ${pagesLabel}`} icon="page" />
        </div>
      </div>
      {actionQuote && (
        <div className={styles.quoteWrapper}>
          <Quote quote={actionQuote} type="intro" />
        </div>
      )}
    </section>
  );
}
