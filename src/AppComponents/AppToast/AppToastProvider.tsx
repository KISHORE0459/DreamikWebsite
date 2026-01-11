"use client";

import { Toaster } from "react-hot-toast";

const AppToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        error: {
          style: {
            background: "#C74243",
            color: "white",
          },
        },
        success: {
          style: {
            background: "#008000",
            color: "white",
          },
        },
      }}
    />
  );
};

export default AppToastProvider;
