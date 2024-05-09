import React from "react";
import { ErrorBoundary } from "components/error-boundary";
import ErrorPage from "pages/error";
import Router from "./router";
import "./public/styles/global.css";

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Router />
    </ErrorBoundary>
  );
}
