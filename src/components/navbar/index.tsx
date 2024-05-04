import React from "react";
import { useLocation } from "react-router-dom";
import NavbarDesktop from "./desktop";
import NavbarMobile from "./mobile";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <>
      <NavbarDesktop pathname={pathname} />
      <NavbarMobile pathname={pathname} />
    </>
  );
}
