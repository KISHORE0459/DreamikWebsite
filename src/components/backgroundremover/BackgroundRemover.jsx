"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import { useDropzone } from "react-dropzone";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import UploadIcon from "@mui/icons-material/CloudUpload";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/* ---------------- CONSTANTS ---------------- */
const METHODS = {
  IMG_LY: "ML",
  TENSORFLOW: "AI",
};

const BackgroundRemover = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const bodyPixModelRef = useRef(null);
  const imgRef = useRef(null);

  const [image, setImage] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState(METHODS.TENSORFLOW);
  const [isModelReady, setIsModelReady] = useState(false);

  /* CROP STATE */
  const [crop, setCrop] = useState({ unit: "%", width: 60, x: 20, y: 20 });
  const [cropOpen, setCropOpen] = useState(false);

  /* ---------------- LOAD BODYPIX ---------------- */
  useEffect(() => {
    bodyPix.load().then((model) => {
      bodyPixModelRef.current = model;
      setIsModelReady(true);
    });
  }, []);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageFile = useCallback((file) => {
    if (!file?.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
    setProcessed(null);
  }, []);

  const onDrop = useCallback(
    (files) => files[0] && handleImageFile(files[0]),
    [handleImageFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/*": [] },
    noClick: true,
  });

  /* ---------------- PROCESS IMAGE ---------------- */
  const processImage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      let result;

      if (method === METHODS.TENSORFLOW) {
        if (!isModelReady) return;

        const img = new Image();
        img.src = image;
        await new Promise((r) => (img.onload = r));

        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const seg = await bodyPixModelRef.current.segmentPerson(img);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
          if (!seg.data[i / 4]) imgData.data[i + 3] = 0;
        }

        ctx.putImageData(imgData, 0, 0);
        result = canvas.toDataURL("image/png");
      } else {
        const blob = await fetch(image).then((r) => r.blob());
        const output = await removeBackground(
          new File([blob], "img.png", { type: blob.type })
        );
        result = URL.createObjectURL(output);
      }

      setProcessed(result);
    } catch (err) {
      console.error(err);
      alert("Background removal failed");
    }

    setLoading(false);
  };

  /* ---------------- APPLY CROP ---------------- */
  const applyCrop = () => {
    if (!imgRef.current || !crop.width) return;

    const imageEl = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = imageEl.naturalWidth / imageEl.width;
    const scaleY = imageEl.naturalHeight / imageEl.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imageEl,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setProcessed(canvas.toDataURL("image/png"));
    setCropOpen(false);
  };

  /* ---------------- DOWNLOAD ---------------- */
  const downloadImage = () => {
    if (!processed) return;
    const link = document.createElement("a");
    link.href = processed;
    link.download = "bg-removed.png";
    link.click();
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Free Background Remover | DreamikAI</title>
      </Helmet>

      <Box className="bg-white! flex items-center justify-center p-4!">
        <Box className="bg-white w-full flex flex-col gap-5! max-w-4xl rounded-2xl shadow-lg p-6! space-y-6">
          <Typography variant="h5" align="center" fontWeight={700}>
            Kick out Background (Free)
          </Typography>

          <div className="min-h-[500px] flex justify-center items-center">
            {!image && (
              <Box
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10! text-center hover:cursor-pointer ${
                  isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => fileInputRef.current.click()}
              >
                <input {...getInputProps()} />
                <UploadIcon style={{ fontSize: 34, color: "#6b7280" }} />
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />
                <Typography mt={2} color="text.secondary">
                  Drag & drop an image here
                </Typography>
              </Box>
            )}

            {image && (
              <div className="flex flex-col gap-10! w-full">
                <div className="flex flex-col items-center gap-5!">
                  <Box className="flex justify-center">
                    <ToggleButtonGroup
                      value={method}
                      exclusive
                      onChange={(_, v) => v && setMethod(v)}
                    >
                      <ToggleButton
                        value={METHODS.TENSORFLOW}
                        disabled={!isModelReady}
                      >
                        {isModelReady ? "AI (Accurate)" : "Loading AI…"}
                      </ToggleButton>
                      <ToggleButton value={METHODS.IMG_LY}>
                        ML (Fast)
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={processImage}
                    disabled={loading}
                    className="bg-[#3e9d62]! p-3! rounded-lg max-w-[500px]!"
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Remove Background"
                    )}
                  </Button>
                </div>

                <Box className="w-full! grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="text-center">
                    <Typography fontWeight={600} mb={1}>
                      Original
                    </Typography>
                    <img
                      src={image}
                      className="rounded-lg mx-auto w-full max-h-[300px] object-contain"
                    />
                  </Box>
                  {processed && (
                    <div className="flex flex-col gap-10!">
                      <Box className="text-center">
                        <Typography fontWeight={600} mb={1}>
                          Background Removed
                        </Typography>

                        {loading && (
                          <div className="h-[300px] w-full rounded-lg bg-gray-200 animate-pulse" />
                        )}

                        <img
                          src={processed}
                          className="rounded-lg mx-auto w-full max-h-[300px] object-contain"
                        />
                      </Box>
                      <Box className="flex gap-3 justify-center">
                        <Button
                          variant="contained"
                          onClick={downloadImage}
                          className="bg-[#3e9d62]! h-10! p-3! text-[16px]"
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setCropOpen(true)}
                          className="border-[#3e9d62]! bg-white! text-[#3e9d62]! h-10! p-3!"
                        >
                          Crop
                        </Button>
                      </Box>
                    </div>
                  )}
                </Box>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </Box>
      </Box>

      {/* CROP MODAL */}
      <Dialog open={cropOpen} onClose={() => setCropOpen(false)} maxWidth="md">
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <ReactCrop crop={crop} onChange={setCrop}>
            <img
              ref={imgRef}
              src={processed}
              className="max-h-[500px]! object-contain"
            />
          </ReactCrop>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setCropOpen(false)}
            className="border-red-500! bg-white! text-red-500! h-10! p-3!"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={applyCrop}
            className="bg-[#3e9d62]! p-3! h-10!"
          >
            Apply Crop
          </Button>
        </DialogActions>
      </Dialog>
    </HelmetProvider>
  );
};

export default BackgroundRemover;
