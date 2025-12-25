"use client";

import { useRef } from "react";

const AppCustomUploadButton = ({
  label = "Upload Image",
  setImage,
  accept = "image/*",
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result); // ✅ base64 string
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="w-fit px-3! py-2! rounded-lg! bg-[#3e9d62]! text-white! text-[16px]! font-medium! leading-5! hover:cursor-pointer! hover:shadow-md!"
      >
        {label}
      </button>
    </>
  );
};

export default AppCustomUploadButton;
