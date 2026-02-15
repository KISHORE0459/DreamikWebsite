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
import { useNavigate } from "react-router-dom";

const CheckoutSection = ({
  title = "Product Details",

  price,
  quantity,
  setQuantity,

  showLabelType = false,
  labelType,
  setLabelType,
  labelTypeOptions = [],

  showLabelSize = false,
  labelSize,
  setLabelSize,
  labelSizeOptions = [],

  showExtraSheet = false,
  extraSheet = false,
  setExtraSheet,
  extraSheetPrice = 0,

  handleAddToCart,
  handleDownload,
  sendToWhatsApp,
  onBack,
}) => {
  const navigate = useNavigate();
  return (
    <Box className="w-full bg-white p-6! rounded-2xl! shadow-lg! flex flex-col gap-6!">
      <div className="w-full text-center mb-2!">
        <h2 className="text-[22px]! font-semibold! text-[#12345A]!">{title}</h2>
      </div>

      {showLabelType && (
        <FormControl fullWidth>
          <InputLabel>Label Type</InputLabel>
          <Select
            value={labelType}
            label="Label Type"
            onChange={(e) => setLabelType(e.target.value)}
            className="rounded-lg! h-12! text-left"
          >
            {labelTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {showLabelSize && (
        <FormControl fullWidth>
          <InputLabel>Label Size</InputLabel>
          <Select
            value={labelSize}
            label="Label Size"
            onChange={(e) => setLabelSize(e.target.value)}
            className="rounded-lg! h-12! text-left"
          >
            {labelSizeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <div className="flex items-center gap-4!">
        <span className="text-[18px]! font-medium! text-[#1A1A1A]!">
          Quantity:
        </span>

        <Button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="min-w-10! w-10! h-10! rounded-full! bg-red-600! text-white!"
        >
          <AiOutlineMinus />
        </Button>

        <TextField
          value={quantity}
          type="number"
          size="small"
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 1) setQuantity(val);
          }}
          className="w-20!"
          inputProps={{
            style: {
              textAlign: "center",
              fontSize: "18px",
              height: "40px",
            },
          }}
        />

        <Button
          onClick={() => setQuantity(quantity + 1)}
          className="min-w-10! w-10! h-10! rounded-full! bg-green-600! text-white!"
        >
          <AiOutlinePlus />
        </Button>
      </div>

      <div className="flex items-center gap-1!">
        <span className="text-[18px]! font-medium! text-[#1A1A1A]!">
          Price:
        </span>
        <MdCurrencyRupee className="text-[#3E9D62]!" />
        <span className="text-[22px]! font-semibold! text-[#3E9D62]!">
          {price * quantity}
        </span>
      </div>

      {/* EXTRA SHEET */}
      {showExtraSheet && (
        <div className="flex justify-between items-center bg-gray-100 p-4! rounded-lg!">
          <span className="text-[16px]! font-medium!">
            Add Extra Sheet (₹{extraSheetPrice})
          </span>
          <Button
            onClick={() => setExtraSheet(!extraSheet)}
            className={`px-6! py-2! rounded-lg! text-white! ${
              extraSheet ? "bg-red-600!" : "bg-[#3E9D62]!"
            }`}
          >
            {extraSheet ? "REMOVE" : "ADD"}
          </Button>
        </div>
      )}

      {/* ADD TO CART */}
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
        className="border! w-fit border-[#1A1A1A]! rounded-lg! text-[#1A1A1A]! bg-white!"
      >
        Go Back
      </Button>
    </Box>
  );
};

export default CheckoutSection;
