"use client";

import { useState, useRef, useContext } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";

import PosterBg1 from "../../../public/Poster/PosterBg1.jpeg";
import PosterBg2 from "../../../public/Poster/PosterBg2.jpeg";
// import PosterWatermark from "../../../public/Poster/PosterWatermark.png";

import ImagePersonalizationComp from "../../AppComponents/ImageEdit/ImagePersonalizationComp";
import CheckoutSection from "../../AppComponents/AppCartComps/CheckoutSection";
import { CartContext } from "../CartContext";
import AppCustomUploadButton from "../../AppComponents/AppCommon/AppCustomUploadButton";
import toast from "react-hot-toast";

const Poster = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  /* ---------------- IMAGE ---------------- */
  const [background, setBackground] = useState(PosterBg1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [posterImage, setPosterImage] = useState([PosterBg1, PosterBg2]);

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
  const pricePerItem = 199;
  const totalPrice = pricePerItem * quantity;

  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "poster.png";
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
        skipFonts: true, // safe because we use system fonts
      });

      const productDetails = {
        image: dataUrl,
        quantity,
        price: totalPrice,
        Name: "Custom Poster",
        productcode: "POSTER",
        template: "poster",
        personImage: selectedImage,
        source: "poster-editor",
        datetime: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("OrderData")) || [];
      existing.push(productDetails);
      localStorage.setItem("OrderData", JSON.stringify(existing));

      addToCart();
      navigate("/Order");
    } catch (err) {
      console.error("Capture failed:", err);
      toast.error("Failed to generate poster preview");
    }
  };

  return (
    <div className="w-full mx-auto p-6! grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* PREVIEW (SAFE ZONE) */}
      <div className="flex flex-col gap-5! items-center! justify-center">
        <div
          ref={canvasRef}
          style={{
            position: "relative",
            width: "300px",
            height: "450px",
            border: "2px solid #cccccc",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            fontFamily: "Arial",
          }}
        >
          {/* BACKGROUND */}
          <img
            src={background}
            alt="Poster background"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* USER IMAGE */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="User"
              style={{
                position: "absolute",
                width: "60%",
                height: "40%",
                top: "30%",
                left: "20%",
                transform: `
                  translate(${imageTransforms.translateX}px,
                            ${imageTransforms.translateY}px)
                  scale(${imageTransforms.scale * imageTransforms.mirror},
                        ${imageTransforms.scale})
                  rotate(${imageTransforms.rotate}deg)
                `,
                border: imageBorder ? "2px solid #000000" : "none",
                borderRadius: circleImage ? "9999px" : "0px",
                backgroundColor: "#ffffff",
              }}
            />
          )}

          {/* <img
            src={PosterWatermark}
            alt="Watermark"
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
        <div
          className="max-w-[300px] md:max-w-[400px] flex flex-row flex-wrap gap-2!"
          key={String(posterImage?.length)}
        >
          {posterImage?.map((val) => (
            <div
              className={`w-[70px] h-[100px] p-1! rounded-lg! hover:cursor-pointer! shadow-sm! transition-all duration-200 ease-in ${
                val == background
                  ? "border-2! border-green-700"
                  : "border! border-gray-800!"
              }`}
              onClick={() => setBackground(val)}
            >
              <img
                src={val}
                key={val}
                className="w-full h-full object-cover!"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10!">
        {/* EDIT */}
        <div className="flex flex-col gap-6">
          <AppCustomUploadButton
            setImage={(image) => {
              setBackground(image);
              setPosterImage((state) => [...state, image]);
            }}
            label="Upload Custom Background Image"
          />
          <ImagePersonalizationComp
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setImageTransforms={setImageTransforms}
            imageBorder={imageBorder}
            setImageBorder={setImageBorder}
            circleImage={circleImage}
            setCircleImage={setCircleImage}
          />
        </div>

        {/* CHECKOUT */}
        <CheckoutSection
          title="Poster Details"
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

export default Poster;
