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
  return (
    <Box className="w-full bg-white p-4 rounded-xl shadow flex flex-col gap-6">
      {/* 💵 Price Display */}
      <Box className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-green-600">
          ₹{(price * quantity).toLocaleString("en-IN")}
        </h2>
        <p className="text-gray-600 text-sm">
          ₹{price} × {quantity}
        </p>
      </Box>

      {/* 🔢 Quantity */}
      <Box className="flex items-center gap-3">
        <h3 className="font-semibold">Quantity:</h3>
        <TextField
          type="number"
          size="small"
          value={quantity}
          inputProps={{ min: 1 }}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          sx={{ width: "100px" }}
        />
      </Box>

      {/* 🌈 Matte / Glossy */}
      <Box>
        <FormControl fullWidth>
          <InputLabel>Label Type</InputLabel>
          <Select
            value={labelType}
            label="Label Type"
            onChange={(e) => setLabelType(e.target.value)}
          >
            <MenuItem value="matte">Matte</MenuItem>
            <MenuItem value="glossy">Glossy</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 📐 Size */}
      <Box>
        <FormControl fullWidth>
          <InputLabel>Label Size</InputLabel>
          <Select
            value={labelSize}
            label="Label Size"
            onChange={(e) => setLabelSize(e.target.value)}
          >
            <MenuItem value="Medium - (100mm × 44mm) 12 labels - 36nos">
              Medium - (100mm × 44mm)
            </MenuItem>
            <MenuItem value="Large - (100mm × 58mm) 10 labels - 40nos">
              Large - (100mm × 58mm)
            </MenuItem>
            <MenuItem value="Small - (100mm × 34mm) 16 labels - 32nos">
              Small - (100mm × 34mm)
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ➕ Extra Sheet */}
      <Box className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
        <span className="font-medium">Add Extra Sheet (₹40)</span>
        <Button
          variant="outlined"
          onClick={() => setExtraSheet(!extraSheet)}
          color={extraSheet ? "success" : "primary"}
        >
          {extraSheet ? "Remove" : "Add"}
        </Button>
      </Box>

      {/* 🛒 Add to Cart */}
      <Button
        variant="contained"
        color="success"
        sx={{ py: 1.5, fontWeight: "bold", fontSize: "16px" }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

      {/* 📥 Download */}
      <Button
        variant="contained"
        color="primary"
        sx={{ py: 1.5, fontWeight: "bold" }}
        onClick={handleDownload}
      >
        Download Image
      </Button>

      {/* 💬 WhatsApp */}
      <Button variant="outlined" sx={{ py: 1.5 }} onClick={sendToWhatsApp}>
        WhatsApp Us
      </Button>

      {/* 🔙 Go Back */}
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
};

export default NameSlipCheckoutSection;
