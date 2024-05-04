import React from "react";
import Router from "./router";
import "./styles/globals.css";
import { ErrorBoundary } from "components/error-boundary";
import ErrorPage from "containers/error-page";

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Router />
    </ErrorBoundary>
  );
}
