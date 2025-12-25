"use client";

import React, { useState, useContext } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import * as XLSX from "xlsx";
import { Helmet, HelmetProvider } from "react-helmet-async";

const BulkOrder = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [backgroundImgDataUrl, setBackgroundImgDataUrl] = useState("");
  const [selectedBg, setSelectedBg] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [textFile, setTextFile] = useState(null);
  const [fileData, setFileData] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const pricePerLabel = 50;

  const predefinedBackgrounds = [
    "/image/bkop1.jpg",
    "/image/Diecut-cutout-v3c-DreamikAIComics-Type2-Label-Image-v1-HD-1(1920 x 1080 px).png",
    "/image/DreamikAILabel-Rectangle-1080x1920px-HD-WhiteBK-FlowerTheme-Type2-ImageLeft.png",
  ];

  /* ---------------- BG HANDLERS ---------------- */
  const handlePredefinedBgImageChange = (url) => {
    setBackgroundImgDataUrl(url);
    setSelectedBg(url);
  };

  const handleCustomBgImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBackgroundImgDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- TEXT FILE ---------------- */
  const handleTextFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTextFile(file);

    const reader = new FileReader();
    const ext = file.name.split(".").pop().toLowerCase();

    reader.onload = (event) => {
      let jsonData = [];

      if (ext === "csv") {
        const workbook = XLSX.read(event.target.result, { type: "string" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = rows[0];
        jsonData = rows.slice(1).map((row) =>
          headers.reduce((obj, key, i) => {
            obj[key] = row[i];
            return obj;
          }, {})
        );
      } else {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(sheet);
      }

      setFileData(jsonData);
    };

    ext === "csv" ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
  };

  /* ---------------- IMAGE FOLDER ---------------- */
  const handleImageFolderChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  /* ---------------- GENERATE LABELS ---------------- */
  const generateLabels = () => {
    if (!textFile || imageFiles.length === 0) {
      alert("Upload text file and image folder");
      return;
    }

    const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.innerHTML = "";

    imageFiles.forEach((_, index) => {
      const canvas = document.createElement("canvas");
      canvas.width = 450;
      canvas.height = 300;
      canvas.className = "border border-black shadow-md rounded bg-white";

      canvasContainer.appendChild(canvas);

      setQuantity((q) => q + 1);
      setTotalPrice((p) => p + pricePerLabel);
    });
  };

  /* ---------------- DOWNLOAD ALL ---------------- */
  const downloadAllLabels = () => {
    const zip = new JSZip();
    document.querySelectorAll("#canvasContainer canvas").forEach((c, i) => {
      const img = c.toDataURL().split(",")[1];
      zip.file(`label_${i + 1}.png`, img, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "labels.zip");
    });
  };

  /* ---------------- ADD TO CART ---------------- */
  const saveToLocalStorage = () => {
    const existing = JSON.parse(localStorage.getItem("OrderData")) || [];

    existing.push({
      image: "bulk-preview",
      price: totalPrice,
      quantity,
      type: "Bulk orders",
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem("OrderData", JSON.stringify(existing));
    addToCart();
    navigate("/order");
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Bulk Order | DreamikAI</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100 font-sans p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Kids Label Generator
        </h1>

        {/* BACKGROUND SELECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <p className="font-semibold mb-3">Choose Background</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {predefinedBackgrounds.map((url) => (
              <img
                key={url}
                src={url}
                onClick={() => handlePredefinedBgImageChange(url)}
                className={`w-[200px] h-[140px] cursor-pointer rounded border transition
                  ${
                    selectedBg === url
                      ? "ring-4 ring-green-500 scale-105"
                      : "hover:opacity-70"
                  }`}
              />
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleCustomBgImageChange}
            className="mt-4 block mx-auto"
          />
        </div>

        {/* FILE UPLOADS */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 text-center">
          <input
            type="file"
            accept=".txt,.json,.csv"
            onChange={handleTextFileChange}
            className="mb-3"
          />

          <input
            type="file"
            webkitdirectory="true"
            onChange={handleImageFolderChange}
            className="mb-3"
          />

          <button
            onClick={generateLabels}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Generate Labels
          </button>
        </div>

        {/* CANVAS OUTPUT */}
        <div
          id="canvasContainer"
          className="flex flex-wrap gap-4 justify-center"
        />

        {/* FOOTER ACTIONS */}
        {quantity > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md mt-6 text-center">
            <p className="text-xl font-semibold mb-3">
              Total Price: ₹{totalPrice}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadAllLabels}
                className="border px-5 py-2 rounded hover:bg-gray-100"
              >
                Download All
              </button>

              <button
                onClick={saveToLocalStorage}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default BulkOrder;
