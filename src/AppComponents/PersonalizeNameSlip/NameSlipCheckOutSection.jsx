"use client";

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";
import { IoCaretBackCircle } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const NameSlipCheckoutSection = ({
  price,
  quantity,
  setQuantity,
  labelType,
  setLabelType,
  labelSize,
  setLabelSize,
  extraSheet,
  setExtraSheet,
  handleAddToCart,
  handleDownload,
  sendToWhatsApp,
  navigate,
}) => {
  const labelTypeOption = [
    {
      value: "matte",
      label: "Matte",
    },
    {
      value: "glossy",
      label: "Glossy",
    },
  ];

  const labelSizeOption = [
    {
      value: "Small - (100mm × 34mm) 16 labels - 32nos",
      label: "Small - (100mm × 34mm)",
    },
    {
      value: "Medium - (100mm × 44mm) 12 labels - 36nos",
      label: "Medium - (100mm × 44mm)",
    },
    {
      value: "Large - (100mm × 58mm) 10 labels - 40nos",
      label: "Large - (100mm × 58mm)",
    },
  ];

  return (
    <Box className="w-full bg-white p-4! rounded-xl shadow-md! flex flex-col gap-6 items-start">
      <div className="w-full flex justify-center items-center">
        <h2 className="text-[20px]! font-semibold! text-[#12345A]! leading-5!">
          Product Details
        </h2>
      </div>

      <FormControl fullWidth>
        <InputLabel>Label Type</InputLabel>
        <Select
          value={labelType}
          label="Label Type"
          onChange={(e) => setLabelType(e.target.value)}
          className="w-[300px] h-12 md:w-[400px] text-left! rounded-lg!"
        >
          {labelTypeOption?.map((val) => (
            <MenuItem value={val?.value}>{val?.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Label Size</InputLabel>
        <Select
          value={labelSize}
          label="Label Size"
          onChange={(e) => setLabelSize(e.target.value)}
          className="w-[300px] h-12 md:w-[400px] text-left! rounded-lg!"
        >
          {labelSizeOption?.map((val) => (
            <MenuItem value={val?.value}>{val?.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box className="flex items-center gap-3">
        <h3 className="text-[20px]! text-[#1A1A1A]! font-medium leading-5">
          Quantity:
        </h3>

        <Box className="flex items-center gap-3">
          {/* Decrease Button */}
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="min-w-10! w-10! h-10! rounded-xl! bg-red-600! hover:bg-red-700! flex justify-center items-center"
          >
            <AiOutlineMinus className="text-white text-xl" />
          </Button>

          {/* Quantity Input */}
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 1) setQuantity(val);
            }}
            size="small"
            inputProps={{
              min: 1,
              style: {
                borderRadius: "8px",
                height: "40px",
                border: "none",
                textAlign: "center",
                fontSize: "20px",
                padding: "6px 0",
              },
            }}
            className="w-20! border-none! rounded-lg!"
          />

          {/* Increase Button */}
          <Button
            onClick={() => setQuantity(quantity + 1)}
            className="min-w-10! w-10! h-10! rounded-xl! bg-green-600! hover:bg-green-700! flex justify-center items-center"
          >
            <AiOutlinePlus className="text-white text-xl" />
          </Button>
        </Box>
      </Box>

      <div className="flex flex-row items-center gap-px">
        <h3 className="text-[20px]! text-[#1A1A1A]! font-medium leading-5">
          Price:
        </h3>

        <MdCurrencyRupee className="w-[17px] h-[17px]" fill="#3E9D62" />

        <p className="text-[20px]! font-semibold! text-[#3E9D62]! leading-5">
          {price}
        </p>
      </div>

      <Box className="flex items-center justify-between bg-gray-100 p-3! rounded-lg w-full!">
        <span className="font-medium">Add Extra Sheet (₹40)</span>
        <Button
          variant="outlined"
          onClick={() => setExtraSheet(!extraSheet)}
          color={extraSheet ? "success" : "primary"}
          className={`rounded-lg! ${
            extraSheet ? "bg-red-600!" : "bg-[#3E9D62]!"
          } text-white!`}
        >
          {extraSheet ? "Remove" : "Add"}
        </Button>
      </Box>

      {/* 🛒 Add to Cart */}
      <Button
        variant="contained"
        color="success"
        className="w-[300px] md:w-[400px] bg-[#3E9D62]! rounded-lg! h-12"
        onClick={handleAddToCart}
        startIcon={<PiShoppingCart />}
      >
        Add to Cart
      </Button>

      <div className="flex flex-col md:flex-row items-center gap-5!">
        <Button
          onClick={handleDownload}
          className="w-[200px] h-10 rounded-lg! border! border-[#12345A]! text-[#12345A]! bg-white! hover:bg-[#12345A]! hover:text-white!"
          startIcon={<LuDownload />}
        >
          Download Image
        </Button>

        <Button
          onClick={sendToWhatsApp}
          className="w-[200px] h-10 rounded-lg! border! border-[#3E9D62]! text-[#3E9D62]! bg-white! hover:bg-[#3E9D62]! hover:text-white!"
          startIcon={<FaWhatsapp />}
        >
          WhatsApp Us
        </Button>
      </div>

      <Button
        onClick={() => navigate(-1)}
        startIcon={<IoCaretBackCircle />}
        className="border! border-[#1A1A1A]! rounded-lg! text-[#1A1A1A]! bg-white!"
      >
        Go Back
      </Button>
    </Box>
  );
};

export default NameSlipCheckoutSection;
