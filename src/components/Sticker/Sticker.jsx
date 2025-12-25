"use client";

import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";

import StickerDefault from "../../../public/image/logo.png";
import ImagePersonalizationComp from "../../AppComponents/ImageEdit/ImagePersonalizationComp";
import CheckoutSection from "../../AppComponents/AppCartComps/CheckoutSection";
import { CartContext } from "../CartContext";

const CustomSticker = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [stickerImage, setStickerImage] = useState(StickerDefault);

  const [imageTransforms, setImageTransforms] = useState({
    scale: 1,
    rotate: 0,
    mirror: 1,
    translateX: 0,
    translateY: 0,
  });

  const [imageBorder, setImageBorder] = useState(false);
  const [circleImage, setCircleImage] = useState(false);

  /* ---------------- ORDER ---------------- */
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 99;
  const totalPrice = pricePerItem * quantity;

  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "sticker.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = await toPng(canvasRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: true,
      });

      const productDetails = {
        image: dataUrl,
        quantity,
        price: totalPrice,
        Name: "Custom Sticker",
        productcode: "STICKER",
        template: "sticker",
        personImage: stickerImage,
        source: "sticker-editor",
        datetime: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("OrderData")) || [];
      existing.push(productDetails);
      localStorage.setItem("OrderData", JSON.stringify(existing));

      addToCart();
      navigate("/Order");
    } catch (err) {
      console.error("Sticker export failed:", err);
      alert("Failed to generate sticker preview");
    }
  };

  return (
    <div className="w-full mx-auto p-6! grid grid-cols-1 lg:grid-cols-2 gap-10!">
      {/* ---------------- PREVIEW (SAFE ZONE) ---------------- */}
      <div className="flex justify-center">
        <div
          ref={canvasRef}
          style={{
            position: "relative",
            width: "300px",
            height: "300px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <img
            src={stickerImage}
            alt="Sticker"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `
                translate(${imageTransforms.translateX}px,
                          ${imageTransforms.translateY}px)
                scale(${imageTransforms.scale * imageTransforms.mirror},
                      ${imageTransforms.scale})
                rotate(${imageTransforms.rotate}deg)
              `,
              border: imageBorder ? "2px solid #000" : "none",
              borderRadius: circleImage ? "9999px" : "0px",
              backgroundColor: "#ffffff",
            }}
          />

          {/* OPTIONAL WATERMARK */}
          {/* <img
            src={StickerWatermark}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.9,
              pointerEvents: "none",
            }}
          /> */}
        </div>
      </div>

      {/* ---------------- EDIT + CHECKOUT ---------------- */}
      <div className="flex flex-col gap-8!">
        {/* IMAGE CONTROLS */}
        <ImagePersonalizationComp
          selectedImage={stickerImage}
          setSelectedImage={setStickerImage}
          setImageTransforms={setImageTransforms}
          imageBorder={imageBorder}
          setImageBorder={setImageBorder}
          circleImage={circleImage}
          setCircleImage={setCircleImage}
        />

        {/* CHECKOUT */}
        <CheckoutSection
          title="Sticker Details"
          price={totalPrice}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
          handleDownload={handleDownload}
          onBack={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default CustomSticker;
