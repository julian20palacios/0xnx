import React from "react";
import Sidebar from "./Sidebar";

const PrivateLayout = ({ children }) => (
  <div className="layout private-layout private-theme private-theme-black" style={{ minHeight: "100dvh" }}>
    <div
      className="private-shell"
      style={{ display: "flex", minHeight: "100dvh", width: "100%", overflowX: "hidden", alignItems: "stretch" }}
    >
      <Sidebar />
      <div className="content-area" style={{ flex: 1, minWidth: 0 }}>
        <main className="private-main app-main" style={{ minHeight: "100%", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  </div>
);

export default PrivateLayout;
