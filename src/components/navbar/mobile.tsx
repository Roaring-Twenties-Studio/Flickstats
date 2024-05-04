import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { routes } from "router/routes";
import styles from "./navbar-mobile.module.css";

interface IProps {
  pathname: string;
}

export default function NavbarMobile({ pathname }: IProps) {
  const ref = useRef(null);

  const onClick = () => {
    if (ref && ref.current) {
      //@ts-ignore
      return ref.current.click();
    }
    return null;
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to={routes.home} className={styles.logo}>
          <h1>FLICK</h1>
          <h2>STATS</h2>
        </Link>

        <input
          className={styles.input}
          type="checkbox"
          name="hamburger"
          id="hamburger"
          ref={ref}
        />

        <div className={styles.hamburgerLines}>
          <span className={styles.lineOne}></span>
          <span className={styles.lineTwo}></span>
          <span className={styles.lineThree}></span>
        </div>

        <ul className={styles.menuLinks}>
          <li onClick={onClick}>
            <Link
              to={routes.home}
              className={`${styles.navlinks} ${
                pathname === routes.home && styles.activeLink
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li onClick={onClick}>
            <Link
              to={routes.guide}
              className={`${styles.navlinks} ${
                pathname === routes.guide && styles.activeLink
              }`}
            >
              Guide
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
