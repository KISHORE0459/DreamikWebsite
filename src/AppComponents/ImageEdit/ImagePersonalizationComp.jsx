"use client";

import { Checkbox, FormControlLabel } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";

import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
  HiOutlineArrowCircleUp,
  HiOutlineArrowCircleDown,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
} from "react-icons/hi";
import { LuRotateCw, LuRotateCcw } from "react-icons/lu";
import { MdCameraswitch } from "react-icons/md";
import Cropper from "react-easy-crop";
import Modal from "@mui/material/Modal";

export default function ImagePersonalizationComp({
  selectedImage,
  setSelectedImage,
  handleImageUpload,
  handleDeleteImage,

  imageBorder,
  setImageBorder,

  circleImage,
  setCircleImage,

  setImageTransforms,
  // props for cropping the image
  enableImageCropping = false,
  imageCropSize = { width: 1, height: 1 },
}) {
  // RHF for checkboxes
  const { control, watch } = useForm({
    defaultValues: {
      imageBorder,
      circleImage,
    },
  });

  // cropping states
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // sync RHF -> parent state
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.imageBorder !== imageBorder) setImageBorder(value.imageBorder);
      if (value.circleImage !== circleImage) setCircleImage(value.circleImage);
    });
    return () => subscription.unsubscribe();
  }, [watch, imageBorder, circleImage]);

  // process image & reset file input
  const handleFileChangeLocal = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (enableImageCropping) {
        setCropImageSrc(reader.result);
      } else {
        setSelectedImage(reader.result);
        handleImageUpload?.(e);
      }
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  // image control buttons config
  const imageToolButtons = [
    {
      icon: <HiOutlineZoomIn size={20} />,
      title: "Zoom In",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, scale: p.scale + 0.1 })),
    },
    {
      icon: <HiOutlineZoomOut size={20} />,
      title: "Zoom Out",
      onClick: () =>
        setImageTransforms((p) => ({
          ...p,
          scale: Math.max(0.2, p.scale - 0.1),
        })),
    },
    {
      icon: <LuRotateCw size={20} />,
      title: "Rotate +",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, rotate: p.rotate + 10 })),
    },
    {
      icon: <LuRotateCcw size={20} />,
      title: "Rotate -",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, rotate: p.rotate - 10 })),
    },
    {
      icon: <MdCameraswitch size={20} />,
      title: "Mirror",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, mirror: p.mirror === 1 ? -1 : 1 })),
    },
    {
      icon: <HiOutlineArrowCircleLeft size={20} />,
      title: "Move Left",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, translateX: p.translateX - 5 })),
    },
    {
      icon: <HiOutlineArrowCircleRight size={20} />,
      title: "Move Right",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, translateX: p.translateX + 5 })),
    },
    {
      icon: <HiOutlineArrowCircleUp size={20} />,
      title: "Move Up",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, translateY: p.translateY - 5 })),
    },
    {
      icon: <HiOutlineArrowCircleDown size={20} />,
      title: "Move Down",
      onClick: () =>
        setImageTransforms((p) => ({ ...p, translateY: p.translateY + 5 })),
    },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Upload + preview box */}
        <label className="cursor-pointer">
          <input
            id="ns-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChangeLocal}
            className="hidden"
          />

          {selectedImage ? (
            <div className="w-40 h-36 rounded-lg border! border-gray-300! overflow-hidden flex items-center justify-center bg-gray-50!">
              <img
                src={selectedImage}
                alt="uploaded preview"
                className="max-w-full max-h-full object-contain"
                style={{
                  borderRadius: circleImage ? "9999px" : undefined,
                  border: imageBorder ? "2px solid #000" : "none",
                }}
              />
            </div>
          ) : (
            <div className="w-40 h-36 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <UploadIcon style={{ fontSize: 34, color: "#6b7280" }} />
              <div className="text-xs text-gray-500 mt-2">
                Upload your image
              </div>
            </div>
          )}
        </label>

        {/* Controls */}
        <div className="flex flex-col gap-4 flex-1 border! border-[#979DAC]! p-2! rounded-lg min-h-[100px] shadow-md!">
          {selectedImage ? (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 p-2 rounded-lg">
                {imageToolButtons.map((btn, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-10 h-10 rounded-lg bg-white! border! border-gray-300! flex justify-center items-center text-[#1A1A1A]! p-0! shadow-md! hover:shadow-lg! hover:cursor-pointer!"
                    title={btn.title}
                    onClick={btn.onClick}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>

              {/* Delete + checkboxes */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-10 h-10 rounded-lg bg-white! border! border-red-600! text-red-600! hover:bg-red-600! hover:text-white! flex justify-center items-center p-0! hover:cursor-pointer!"
                  title="Delete"
                  onClick={() => {
                    setSelectedImage(null);
                    handleDeleteImage && handleDeleteImage();
                  }}
                >
                  <IoTrashBin size={20} />
                </button>

                <Controller
                  name="imageBorder"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Image Border"
                    />
                  )}
                />

                <Controller
                  name="circleImage"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Circle Crop"
                    />
                  )}
                />
              </div>
            </>
          ) : (
            <div className="min-h-[100px] flex justify-center items-center text-sm text-gray-500">
              Upload an image to see controls
            </div>
          )}
        </div>
      </div>
      <div className="h-px! w-full! bg-[#434343]! my-2.5!"></div>
      <Modal open={!!cropImageSrc} onClose={() => setCropImageSrc(null)}>
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4! w-[90vw] max-w-md">
            <div className="relative w-full h-[300px]">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={imageCropSize.width / imageCropSize.height}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <div className="flex justify-end gap-3! mt-4!">
              <button
                className="px-4! py-2! bg-white! border rounded-lg hover:cursor-pointer hover:shadow-md"
                onClick={() => setCropImageSrc(null)}
              >
                Cancel
              </button>

              <button
                className="px-4! py-2! bg-black! text-white! rounded-lg hover:cursor-pointer! hover:shadow-md"
                onClick={async () => {
                  const cropped = await getCroppedImg(
                    cropImageSrc,
                    croppedAreaPixels
                  );
                  setSelectedImage(cropped);
                  setCropImageSrc(null);
                }}
              >
                Crop & Use
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
