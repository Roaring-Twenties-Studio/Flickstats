import React from "react";
import Router from "./router";
import { ErrorBoundary } from "components/error-boundary";
import ErrorPage from "pages/error";
import "./styles/globals.css";

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Router />
    </ErrorBoundary>
  );
}
