import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageView from "./pages/PageView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageView />} />
      <Route path="/p/:id" element={<PageView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}