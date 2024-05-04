import React from "react";
import Quote from "components/quote";
import type { ParsedScreenplay } from "models/screenplay";
import styles from "./style.module.css";

interface IProps {
  heroQuote: ParsedScreenplay["heroQuote"];
}

export default function HeroApperance({ heroQuote }: IProps) {
  return heroQuote.author ? (
    <div className={styles.root}>
      <p className={styles.title}>{heroQuote.author}</p>
      <span>is our hero</span>
      <div className={styles.quotePush} />
      {heroQuote.quote ? (
        <Quote quote={heroQuote.quote} type="end" />
      ) : (
        <p className={styles.noQuote}>No quote detected</p>
      )}
    </div>
  ) : (
    <div className={styles.root}>
      <span>No hero detected</span>
    </div>
  );
}
