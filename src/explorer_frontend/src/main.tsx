import "./index.css";
import "@radix-ui/themes/styles.css";
import "github-markdown-css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App";
import DomainRouter from "./DomainRouter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme accentColor="green">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <DomainRouter>
                <App />
              </DomainRouter>
            }
          />
          <Route
            path="/:storeId"
            element={
              <DomainRouter>
                <App />
              </DomainRouter>
            }
          />
        </Routes>
      </Router>
    </Theme>
  </React.StrictMode>
);
