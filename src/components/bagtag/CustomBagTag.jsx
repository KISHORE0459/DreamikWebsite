"use client";

import {
  Box,
  Stack,
  Typography,
  Divider,
  MenuItem,
  Select,
} from "@mui/material";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import ImagePersonalizationComp from "../../AppComponents/ImageEdit/ImagePersonalizationComp";
import EditableInput from "../../AppComponents/InputEdit/EditableInput";
import { useContext } from "react";
import { CartContext } from "../CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutSection from "../../AppComponents/AppCartComps/CheckoutSection";
import toast from "react-hot-toast";

const CustomBagTag = () => {
  // commit to change the path
  const canvasRef = useRef(null);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  /* ---------------- PRODUCT DATA ---------------- */
  const [productData, setProductData] = useState(null);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    fetch("/bagtag.json")
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
        const firstImage = Object.values(data.images || {})[0];
        if (firstImage) setBgImage(firstImage);
      })
      .catch(console.error);
  }, []);

  /* ---------------- IMAGE STATE ---------------- */
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBorder, setImageBorder] = useState(false);
  const [circleImage, setCircleImage] = useState(false);

  const [imageTransforms, setImageTransforms] = useState({
    scale: 1,
    rotate: 0,
    mirror: 1,
    translateX: 0,
    translateY: -20,
  });

  /* ---------------- TEXT STATE ---------------- */
  const [textValues, setTextValues] = useState({ name: "" });

  const [labelTransforms, setLabelTransforms] = useState({
    nameTrans: {
      fontSize: 24,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 400,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
      opacity: 1,
    },
  });

  console.log("text", textValues);

  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "bagtag.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      toast.error("Set quantity at least 1");
      return;
    }

    if (!canvasRef.current) return;

    try {
      // 1️⃣ Capture preview
      const canvas = await html2canvas(canvasRef.current, { scale: 2 });
      const imageData = canvas.toDataURL("image/png");

      // 2️⃣ Timestamp (same format)
      const now = new Date();
      const formattedDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      // 3️⃣ Extract label data (name only)
      const t = labelTransforms.nameTrans;

      const labels = [
        {
          className: "bagtag-name",
          text: [textValues.name],
          fontSize: `${t.fontSize}px`,
          scale: t.scale,
          fontColor: t.color,
          fontFamily: t.fontFamily,
          rotate: t.rotate,
          translateX: t.translateX,
          translateY: t.translateY,
          mirror: t.mirror,
        },
      ];

      // 4️⃣ Build product details (MATCH NameSlip STRUCTURE)
      const productDetails = {
        image: imageData, // Base64 preview
        quantity,
        price: (productData?.price || 250) * quantity,
        Name: productData?.name || "Custom Bag Tag",
        labeltype: "default",
        size: "standard",
        labels,
        productcode: productData?.productcode || "BAGTAG",
        template: "bagtag",
        personImage: selectedImage,
        source: "bagtag-editor",
        datetime: formattedDateTime,
      };

      // 5️⃣ Push to cart (same logic)
      const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];

      existingCart.push(productDetails);

      localStorage.setItem("OrderData", JSON.stringify(existingCart));

      // 6️⃣ Update cart UI
      addToCart();

      toast.success("Bag tag added to cart successfully!");
      navigate("/Order");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Something went wrong while adding to cart");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans p-6!">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 flex justify-center">
          <div
            ref={canvasRef}
            style={{
              position: "relative",
              width: "310px",
              height: "460px",
              border: "2px solid #ccc",
              backgroundColor: "#ffffff",
              color: "#000000",
              overflow: "hidden",
            }}
          >
            {bgImage && (
              <img
                src={bgImage}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {selectedImage && (
              <img
                src={selectedImage}
                className="absolute border-2 border-gray-600 transition-transform duration-200 ease-in-out"
                style={{
                  width: "60%",
                  height: "40%",
                  top: "25%",
                  left: "20%",
                  transform: `
            translate(${imageTransforms.translateX}px, ${
                    imageTransforms.translateY
                  }px)
            scale(${imageTransforms.scale * imageTransforms.mirror}, ${
                    imageTransforms.scale
                  })
            rotate(${imageTransforms.rotate}deg)
          `,
                  border: imageBorder ? "2px solid #000" : "none",
                  borderRadius: circleImage ? "9999px" : "0px",
                }}
              />
            )}

            {/* TEXT */}
            <Typography
              component="div"
              style={{
                fontSize: `${labelTransforms?.nameTrans?.fontSize}px`,
                fontWeight: 500,
                color: labelTransforms?.nameTrans?.color || "#000",
                fontFamily: labelTransforms?.nameTrans?.fontFamily || "Arial",
                opacity: labelTransforms?.nameTrans?.opacity ?? 1,
                whiteSpace: "nowrap",
                transform: `
      translate(${labelTransforms?.nameTrans?.translateX}px,
                ${labelTransforms?.nameTrans?.translateY}px)
      scale(${labelTransforms?.nameTrans?.scale})
      rotate(${labelTransforms?.nameTrans?.rotate}deg)
      scaleX(${labelTransforms?.nameTrans?.mirror})
    `,
              }}
            >
              {textValues?.name}
            </Typography>
          </div>
        </div>

        <Stack className="col-span-7 gap-5!">
          {productData?.images && (
            <div className="flex flex-col gap-2! items-start!">
              <Typography fontWeight={600} mb={1}>
                Select Background
              </Typography>
              <Select
                fullWidth
                value={bgImage}
                onChange={(e) => setBgImage(e.target.value)}
                className="text-left"
              >
                {Object.entries(productData.images).map(([label, img]) => (
                  <MenuItem key={label} value={img}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          <ImagePersonalizationComp
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            imageBorder={imageBorder}
            setImageBorder={setImageBorder}
            circleImage={circleImage}
            setCircleImage={setCircleImage}
            setImageTransforms={setImageTransforms}
          />

          <EditableInput
            fieldKey="name"
            label="Name"
            value={textValues.name}
            onChange={(v) => setTextValues((p) => ({ ...p, name: v }))}
            labelTransforms={labelTransforms}
            setLabelTransforms={setLabelTransforms}
          />

          <CheckoutSection
            title="Bag Tag Details"
            price={productData?.price}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            handleDownload={handleDownload}
            onBack={() => navigate(-1)}
          />
        </Stack>
      </div>
    </div>
  );
};

export default CustomBagTag;
