import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";

export default function Newsletter() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <div className="w-full rounded-2xl py-10! px-6! flex flex-col items-center justify-center gap-6 bg-gradient-to-r from-[#21436b] via-[#3d4054] to-[#693b31] text-center shadow-xl">
      <h3 className="text-white! text-[22px]! font-semibold! leading-5">
        Sign Up For Newsletters
      </h3>

      <div className="flex flex-col gap-1 w-full items-center">
        <p className="text-gray-200 text-[15px]">
          Get E-mail updates about our latest shop and{" "}
          <span className="text-yellow-300 font-semibold">special offers.</span>
        </p>
        <div className="w-full max-w-3xl flex items-center gap-3 mt-4">
          {/* FIXED TEXTFIELD */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your email"
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                height: "48px", // <-- FIX HEIGHT
              },
              "& input": {
                padding: "12px 14px",
              },
            }}
          />

          {/* FIXED BUTTON */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1b345f",
              height: "48px",
              paddingX: "28px",
              textTransform: "none",
              fontSize: "15px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              ":hover": {
                backgroundColor: "#1b345f",
                boxShadow: "0px 1px 5px 0px white",
              },
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
