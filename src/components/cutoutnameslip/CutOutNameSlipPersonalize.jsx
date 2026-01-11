"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { HelmetProvider } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import { compressImageIfNeeded } from "../imagecompressor/imagecompressor";
import NameSlipPreviewSection from "../../AppComponents/PersonalizeNameSlip/NameSlipPreviewSection";
import NameSlipPersonalizationSection from "../../AppComponents/PersonalizeNameSlip/NameSlipPersonalizationSection";
import NameSlipCheckoutSection from "../../AppComponents/PersonalizeNameSlip/NameSlipCheckOutSection";
import { processWithImgly } from "./removebgTF";
import toast from "react-hot-toast";

const CutoutNameSlipPersonalize = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const persImgRef = useRef(null);

  // -------------------------------
  // ✅ ALL HOOKS MUST BE HERE AT TOP
  // -------------------------------
  const [product, setProduct] = useState(null);

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    schoolName: "",
    subject: [],
    rollNumber: "",
    section: "",
    class: "",
  });

  const defaultLabel = {
    fontSize: 30,
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    mirror: 1,
    color: "#322d95",
    fontFamily: "Arial",
  };

  const [labelTransforms, setLabelTransforms] = useState({
    nameTrans: { ...defaultLabel },
    schoolTrans: { ...defaultLabel },
    subjectTrans: { ...defaultLabel },
    rollTrans: { ...defaultLabel },
    sectionTrans: { ...defaultLabel },
    classTrans: { ...defaultLabel },
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [imageTransforms, setImageTransforms] = useState({
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    mirror: 1,
  });

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [imageBorder, setImageBorder] = useState(false);
  const [circleImage, setCircleImage] = useState(false);
  const [isImageBack, setIsImageBack] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [labelType, setLabelType] = useState("glossy");
  const [labelSize, setLabelSize] = useState("Medium");
  const [extraSheet, setExtraSheet] = useState(false);

  const cutoutConfigs = {
    image: {
      enabled: true,
      top: "20%",
      left: "-2%",
      width: "32%",
      shape: "rect",
    },

    labels: {
      name: { top: "22%", left: "31%" },
      school: { top: "64%", left: "49%" },
      class: { top: "36%", left: "42%" },
      section: { top: "36%", left: "74%" },
      roll: { top: "55%", left: "30%" },
      subject: { top: "50%", left: "50%" },
    },
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch("/cutoutnameslip_data.json");
        const data = await response.json();

        const key = localStorage.getItem("keyid");
        if (key && data[key]) {
          setProduct(data[key]);
          document.title = data[key].name;
        }
      } catch (err) {
        console.error("Product load failed:", err);
      }
    };

    loadProduct();
  }, []);

  // -------------------------------
  // CONDITIONAL RENDER SAFE NOW
  // -------------------------------
  if (!product) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        Loading product…
      </div>
    );
  }

  // -------------------------------
  // IMAGE UPLOAD
  // -------------------------------
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setImageTransforms({
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
    });
  };

  const price = product.price + (extraSheet ? 40 : 0);

  const handleDownload = async () => {
    const canvas = await html2canvas(persImgRef.current, {
      backgroundColor: null,
    });
    const link = document.createElement("a");
    link.download = "cutout.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleAddToCart = async () => {
    const canvas = await html2canvas(persImgRef.current, {
      backgroundColor: null,
    });

    const img = canvas.toDataURL();

    const item = {
      image: img,
      productID: product.productcode,
      name: product.name,
      quantity,
      labelType,
      labelSize,
      extraSheet,
      price: price * quantity,
      selectedImage,
      studentDetails,
      labelTransforms,
    };

    const prev = JSON.parse(localStorage.getItem("OrderData")) || [];
    prev.push(item);
    localStorage.setItem("OrderData", JSON.stringify(prev));

    toast.success("Added to cart!");
    navigate("/Order");
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------
  return (
    <HelmetProvider>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4!">
        {/* LEFT SIDE - PREVIEW */}
        <NameSlipPreviewSection
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
          isImageBack={isImageBack}
          config={cutoutConfigs}
        />

        {/* RIGHT SIDE - CONTROLS */}
        <div className="flex flex-col gap-6">
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
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isCutout={true}
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
          />
        </div>
      </main>
    </HelmetProvider>
  );
};

export default CutoutNameSlipPersonalize;
