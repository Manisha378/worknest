"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e4e4e7",
          borderRadius: "0.75rem",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
        className: "toast",
      }}
      closeButton
    />
  );
}