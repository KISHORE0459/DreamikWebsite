"use client";

import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import ColorPicker from "react-best-gradient-color-picker"; // ⭐ NEW BEST UI PICKER

import {
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
  HiOutlineArrowCircleUp,
  HiOutlineArrowCircleDown,
} from "react-icons/hi";
import { LuRotateCw, LuRotateCcw } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";

const TextEditPanel = ({
  open,
  fieldKey,
  labelTransforms,
  setLabelTransforms,
  onClose,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  if (!open) return null;

  const transforms = labelTransforms?.[fieldKey] || {};

  const update = (patch) => {
    setLabelTransforms((prev) => ({
      ...prev,
      [fieldKey]: { ...(prev[fieldKey] || {}), ...patch },
    }));
  };

  const changeFont = (delta) =>
    update({ fontSize: Math.max(6, (transforms.fontSize || 16) + delta) });

  const move = (dx, dy) =>
    update({
      translateX: (transforms.translateX || 0) + dx,
      translateY: (transforms.translateY || 0) + dy,
    });

  const rotate = (d) => update({ rotate: (transforms.rotate || 0) + d });

  const controlButtons = [
    {
      icon: <HiOutlineZoomIn size={20} />,
      title: "A+",
      onClick: () => changeFont(+2),
    },
    {
      icon: <HiOutlineZoomOut size={20} />,
      title: "A-",
      onClick: () => changeFont(-2),
    },
    {
      icon: <HiOutlineArrowCircleLeft size={20} />,
      title: "Left",
      onClick: () => move(-5, 0),
    },
    {
      icon: <HiOutlineArrowCircleRight size={20} />,
      title: "Right",
      onClick: () => move(5, 0),
    },
    {
      icon: <HiOutlineArrowCircleUp size={20} />,
      title: "Up",
      onClick: () => move(0, -5),
    },
    {
      icon: <HiOutlineArrowCircleDown size={20} />,
      title: "Down",
      onClick: () => move(0, 5),
    },
    {
      icon: <LuRotateCw size={20} />,
      title: "Rotate +",
      onClick: () => rotate(10),
    },
    {
      icon: <LuRotateCcw size={20} />,
      title: "Rotate -",
      onClick: () => rotate(-10),
    },
  ];

  return (
    <div
      className="mt-3 rounded-md bg-gray-50 flex flex-col gap-3 shadow-md"
      style={{
        border: "1px solid #12345A",
        padding: 12,
      }}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onClose}
      >
        <div className="text-[16px]! font-medium text-[#12345A]!">
          Text Editor
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600 mr-2">
            {transforms.fontSize ? `${transforms.fontSize}px` : "—"}
          </div>

          <IconButton size="small">
            <IoIosClose />
          </IconButton>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {controlButtons.map((btn, i) => (
          <button
            key={i}
            type="button"
            className="w-10 h-10 rounded-lg! bg-white! border! border-gray-300! flex justify-center items-center p-0! text-[#1A1A1A]! shadow-sm hover:shadow-md"
            title={btn.title}
            onClick={btn.onClick}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Color */}
      <div className="flex items-center gap-2">
        <div className="text-[15px]! font-medium">Pick the Text Color :</div>

        <div
          role="button"
          onClick={() => setShowPicker(true)}
          className="w-10 h-7 rounded-sm border cursor-pointer"
          style={{
            background: transforms.color || "#000",
            border: "1px solid rgba(156,163,175,1)",
          }}
        />

        <div className="text-xs text-gray-600">
          {transforms.color?.toUpperCase() || "—"}
        </div>
      </div>

      {/* Modal Picker */}
      <Dialog open={showPicker} onClose={() => setShowPicker(false)}>
        <DialogContent dividers>
          <ColorPicker
            value={transforms.color || "#000"}
            onChange={(newColor) => update({ color: newColor })}
            hideEyeDrop // cleaner UI
            hideInputs // no HEX input bar (cleaner look)
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setShowPicker(false)}
            className="text-[#da1414]! border! border-[#da1414]! rounded-md! bg-white! hover:bg-white!"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TextEditPanel;
