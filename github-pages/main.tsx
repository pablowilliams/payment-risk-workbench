import React from "react";
import { createRoot } from "react-dom/client";
import { PaymentRiskWorkbench } from "../components/PaymentRiskWorkbench";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PaymentRiskWorkbench />
  </React.StrictMode>,
);
