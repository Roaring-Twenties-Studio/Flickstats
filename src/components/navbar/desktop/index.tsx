import React from "react";
import { Link } from "react-router-dom";
import { routes } from "router/routes";
import styles from "./style.module.css";

interface IProps {
  pathname: string;
}

export default function NavbarDesktop({ pathname }: IProps) {
  return (
    <div className={styles.navbar}>
      <Link to={routes.home} className={styles.logo}>
        <h1>FLICK</h1>
        <h2>STATS</h2>
      </Link>
      <div>
        <Link
          to={routes.home}
          className={`${styles.navlinks} ${
            pathname === routes.home && styles.activeLink
          }`}
        >
          Dashboard
        </Link>
        <Link
          to={routes.guide}
          className={`${styles.navlinks} ${
            pathname === routes.guide && styles.activeLink
          }`}
        >
          Guide
        </Link>
      </div>
    </div>
  );
}
