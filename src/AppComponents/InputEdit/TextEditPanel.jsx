"use client";

import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

import ColorPicker from "react-best-gradient-color-picker";

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

const FONT_OPTIONS = [
  "Arial",
  "Times New Roman",
  "Poppins",
  "Roboto",
  "Montserrat",
  "Comic Sans MS",
  "Georgia",
  "Verdana",
];

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

  /* -------------------- FONT SIZE (Quantity Style) -------------------- */
  const fontSize = transforms.fontSize || 16;

  const changeFontSize = (delta) =>
    update({ fontSize: Math.max(6, fontSize + delta) });

  const setFontSizeDirect = (value) => {
    const num = Number(value);
    if (!isNaN(num) && num >= 6 && num <= 200) {
      update({ fontSize: num });
    }
  };

  /* -------------------- MOVE / ROTATE -------------------- */
  const move = (dx, dy) =>
    update({
      translateX: (transforms.translateX || 0) + dx,
      translateY: (transforms.translateY || 0) + dy,
    });

  const rotate = (d) => update({ rotate: (transforms.rotate || 0) + d });

  const controlButtons = [
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
      className="mt-3 rounded-md bg-gray-50 flex flex-col gap-4 shadow-md"
      style={{ border: "1px solid #12345A", padding: 12 }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onClose}
      >
        <div className="text-[16px]! font-medium text-[#12345A]!">
          Text Editor
        </div>

        <IconButton size="small">
          <IoIosClose size={25} />
        </IconButton>
      </div>

      {/* FONT SIZE (Quantity Style) */}
      <div className="flex items-center gap-3">
        <div className="font-medium text-[15px]!">Font Size</div>

        <div className="flex items-center border rounded-md overflow-hidden bg-white">
          <button
            className="w-10 h-10 rounded-lg! bg-white! border! border-gray-300! flex justify-center items-center shadow-sm hover:shadow-md text-black! p-0!"
            onClick={() => changeFontSize(-1)}
          >
            −
          </button>

          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSizeDirect(e.target.value)}
            className="w-16 text-center outline-none"
          />

          <button
            className="w-10 h-10 rounded-lg! bg-white! border! border-gray-300! flex justify-center items-center shadow-sm hover:shadow-md text-black! p-0!"
            onClick={() => changeFontSize(1)}
          >
            +
          </button>
        </div>
      </div>

      {/* FONT FAMILY */}
      <div className="flex items-center gap-3">
        <div className="font-medium text-[15px]! shrink-0">Font Type</div>

        <Select
          size="small"
          fullWidth
          value={transforms.fontFamily || "Arial"}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="text-left! max-w-[200px] md:max-w-[300px]"
        >
          {FONT_OPTIONS.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* MOVE / ROTATE */}
      <div className="flex flex-wrap gap-2 items-center">
        {controlButtons.map((btn, i) => (
          <button
            key={i}
            type="button"
            className="w-10 h-10 rounded-lg! bg-white! border! border-gray-300! flex justify-center items-center shadow-sm hover:shadow-md text-black! p-0!"
            onClick={btn.onClick}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* COLOR */}
      <div className="flex items-center gap-2">
        <div className="font-medium text-[15px]!">Text Color</div>

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

      {/* COLOR PICKER MODAL */}
      <Dialog open={showPicker} onClose={() => setShowPicker(false)}>
        <DialogContent dividers>
          <ColorPicker
            value={transforms.color || "#000"}
            onChange={(c) => update({ color: c })}
            hideEyeDrop
            hideInputs
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setShowPicker(false)}
            className="text-[#da1414]! border! border-[#da1414]! bg-white!"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TextEditPanel;
