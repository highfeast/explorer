import "./index.css";
import "@radix-ui/themes/styles.css";
import "github-markdown-css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";

import App from "./App";
import DomainRouter from "./DomainRouter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme accentColor="green">
      <DomainRouter>
        <App />
      </DomainRouter>
    </Theme>
  </React.StrictMode>
);
