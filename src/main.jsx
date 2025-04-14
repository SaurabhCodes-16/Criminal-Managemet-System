import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Keep BrowserRouter here
import App from "./App.jsx";
import "./index.css"; // Optional for styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>  {/* Only one Router here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
