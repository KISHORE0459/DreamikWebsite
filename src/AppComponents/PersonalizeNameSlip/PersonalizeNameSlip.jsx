"use client";

import { useState, useRef, useMemo, useContext } from "react";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";

// CHILD COMPONENTS
import NameSlipPreviewSection from "./NameSlipPreviewSection";
import NameSlipCheckoutSection from "./NameSlipCheckOutSection";
import NameSlipPersonalizationSection from "./NameSlipPersonalizationSection";

// LOAD TEMPLATE LAYOUTS
import templateConfigs from "./templates.json";

// LOAD PRODUCT DETAILS
import productData from "../../../public/nameslip_data.json";
import { CartContext } from "../../components/CartContext";

const NameSlipPersonalize = () => {
  const { templateID, id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const persImgRef = useRef(null);

  // -----------------------------------------
  // TEMPLATE
  // -----------------------------------------
  const templateConfig = useMemo(
    () => templateConfigs?.[templateID],
    [templateID]
  );

  if (!templateConfig) {
    return <div className="p-10 text-red-600">Template not found!</div>;
  }

  // -----------------------------------------
  // PRODUCT (by productcode)
  // -----------------------------------------
  const product = useMemo(() => {
    if (!productData) return null;
    return Object.values(productData).find((item) => item.productcode === id);
  }, [id, productData]);

  if (!product) {
    return <div className="p-10 text-red-600">Product not found!</div>;
  }

  // -----------------------------------------
  // IMAGE + LABEL STATE
  // -----------------------------------------
  const [selectedImage, setSelectedImage] = useState(null);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  const [imageBorder, setImageBorder] = useState(false);
  const [circleImage, setCircleImage] = useState(false);

  const [imageTransforms, setImageTransforms] = useState({
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    mirror: 1,
  });

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    schoolName: "",
    subject: [],
    rollNumber: "",
    section: "",
    class: "",
  });

  const [labelTransforms, setLabelTransforms] = useState({
    nameTrans: {
      fontSize: 32,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
    },
    schoolTrans: {
      fontSize: 30,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
    },
    subjectTrans: {
      fontSize: 28,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
    },
    rollTrans: {
      fontSize: 26,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
    },
    sectionTrans: {
      fontSize: 26,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
    },
    classTrans: {
      fontSize: 26,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#000",
      fontFamily: "Arial",
    },
  });

  const [fontFamily, setFontFamily] = useState("Arial");

  // -----------------------------------------
  // COLOR CHANGE HANDLER (updates all labels)
  // -----------------------------------------
  const handlecolorchange = (hex) => {
    setLabelTransforms((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key] = { ...prev[key], color: hex };
      }
      return updated;
    });
  };

  // -----------------------------------------
  // DELETE IMAGE HANDLER
  // -----------------------------------------
  const handleDeleteImage = () => {
    setSelectedImage(null);
  };

  // -----------------------------------------
  // CHECKOUT STATE
  // -----------------------------------------
  const [labelType, setLabelType] = useState("matte");
  const [labelSize, setLabelSize] = useState("Medium - 100 × 44 mm");
  const [extraSheet, setExtraSheet] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const basePrice = product.price || 100;
  const glossyExtra = product.glossy || 60;

  const price =
    basePrice +
    (labelType === "glossy" ? glossyExtra : 0) +
    (extraSheet ? 40 : 0);

  // -----------------------------------------
  // IMAGE UPLOAD
  // -----------------------------------------
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  // -----------------------------------------
  // DOWNLOAD IMAGE
  // -----------------------------------------
  const handleDownload = async () => {
    if (!persImgRef.current) return;

    const canvas = await html2canvas(persImgRef.current);
    const link = document.createElement("a");
    link.download = "name-slip.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // -----------------------------------------
  // ADD TO CART
  // -----------------------------------------
  const handleAddToCart = async () => {
    if (quantity <= 0) {
      return alert("Set quantity atleast 1 ");
    }

    if (persImgRef.current) {
      try {
        const canvas = await html2canvas(persImgRef.current);
        const imageData = canvas.toDataURL("image/png"); // Export as a Base64 image

        const now = new Date();
        const formattedDateTime = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(
          2,
          "0"
        )}:${String(now.getSeconds()).padStart(2, "0")}`;

        // Ensure price and quantity are being passed correctly
        const productDetails = {
          image: imageData, // Base64 image data
          quantity: quantity, // User-selected quantity
          price: price * quantity, // Calculated price for the given quantity
          Name: product.name, // Product name
          labeltype: labelType, // Example for extra info like label type
          size: `${labelSize}${extraSheet}`, // Size information (if needed)
          labels: [],
          productcode: product.productcode, // Ensure this is initialized
          template: product.template,
          personImage: selectedImage,
          source: product.source,
          datetime: formattedDateTime, // Added custom formatted date-time
        };

        const rgbToHex = (rgb) => {
          const rgbValues = rgb.match(/\d+/g); // Extract numeric values from rgb string
          if (!rgbValues) return "#000000"; // Fallback to black if invalid
          return `#${rgbValues
            .map((value) => parseInt(value, 10).toString(16).padStart(2, "0"))
            .join("")}`.toUpperCase();
        };
        // Define all label classes
        const labelClasses = [
          "studentname-lab1",
          "schoolname-lab1",
          "subjectname-lab1",
          "rollnu-lab1",
          "sectionname-lab1",
          "classname-lab1",
        ];

        // Map through each label class
        labelClasses.forEach((labelClass) => {
          const label = document.querySelector(`.${labelClass}`);
          if (label) {
            const styles = window.getComputedStyle(label);
            const scaleMatch = styles.transform.match(/matrix\((\d+\.?\d*),/);
            const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
            const fontSize = parseFloat(styles.fontSize) * scale;
            const fontColor = rgbToHex(styles.color);
            const rect = textRef.current.getBoundingClientRect();
            productDetails.labels.push({
              className: labelClass,
              text: [label.textContent],
              fontSize: `${fontSize}px`,
              scale,
              fontColor,
              fontFamily: styles.fontFamily,
              fontStyle: styles.fontStyle,
              ...(labelClass.startsWith("subject") && {
                position: {
                  x: rect.left + window.scrollX,
                  y: rect.top + window.scrollY,
                },
                subjectCount: label.textContent.trim()
                  ? `${(label.textContent.match(/,/g) || []).length + 1}`
                  : "0",
              }),
            });
          } else {
            console.warn(`Label with class .${labelClass} not found.`);
          }
        });

        const existingCart =
          JSON.parse(localStorage.getItem("OrderData")) || [];

        // Push the new product to the cart
        existingCart.push(productDetails);

        // Store the updated cart back into localStorage
        localStorage.setItem("OrderData", JSON.stringify(existingCart));

        // Update cart count
        addToCart();

        localStorage.removeItem("editedproduct");
        alert("Product added to cart successfully!");
      } catch (error) {
        console.error("Error capturing the div:", error);
      }
    }
    navigate("/Order");
  };

  // -----------------------------------------
  // WHATSAPP
  // -----------------------------------------
  const sendToWhatsApp = () => {
    window.open("https://wa.me/919498088659", "_blank");
  };

  // -----------------------------------------
  // UI LAYOUT (MATCHING YOUR SCREENSHOT)
  // -----------------------------------------
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4!">
      {/* LEFT SIDE — PREVIEW */}
      <div className="flex justify-center">
        <NameSlipPreviewSection
          config={templateConfig}
          product={product}
          selectedImage={selectedImage}
          brightness={brightness}
          contrast={contrast}
          imageBorder={imageBorder}
          circleImage={circleImage}
          imageTransforms={imageTransforms}
          labelTransforms={labelTransforms}
          studentDetails={studentDetails}
          persImgContRef={persImgRef}
        />
      </div>

      {/* RIGHT SIDE — PERSONALIZATION + CHECKOUT */}
      <div className="flex flex-col gap-6">
        {/* PERSONALIZATION PANEL */}
        <NameSlipPersonalizationSection
          studentDetails={studentDetails}
          setStudentDetails={setStudentDetails}
          labelTransforms={labelTransforms}
          setLabelTransforms={setLabelTransforms}
          imageTransforms={imageTransforms}
          setImageTransforms={setImageTransforms}
          brightness={brightness}
          setBrightness={setBrightness}
          contrast={contrast}
          setContrast={setContrast}
          imageBorder={imageBorder}
          setImageBorder={setImageBorder}
          circleImage={circleImage}
          setCircleImage={setCircleImage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleImageUpload={handleImageUpload}
          handleDeleteImage={handleDeleteImage}
          handlecolorchange={handlecolorchange}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
        />

        <NameSlipCheckoutSection
          price={price}
          quantity={quantity}
          setQuantity={setQuantity}
          labelType={labelType}
          setLabelType={setLabelType}
          labelSize={labelSize}
          setLabelSize={setLabelSize}
          extraSheet={extraSheet}
          setExtraSheet={setExtraSheet}
          handleAddToCart={handleAddToCart}
          handleDownload={handleDownload}
          sendToWhatsApp={sendToWhatsApp}
          navigate={navigate}
        />
      </div>
    </main>
  );
};

export default NameSlipPersonalize;
