"use client";

import { useState, useRef, useMemo, useContext } from "react";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditableInput from "../../AppComponents/InputEdit/EditableInput";
import PencilNamePreview from "./pencilPreviewSection";
import { CartContext } from "../CartContext";
import productData from "../../../public/products.json";
import CheckoutSection from "../../AppComponents/AppCartComps/CheckoutSection";

const CustomPencil = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const persImgRef = useRef(null);

  const [isPreview, setIsPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [labelTransforms, setLabelTransforms] = useState({
    nameTrans: {
      fontSize: 14,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
      color: "#333",
      fontFamily: "Arial",
    },
  });

  const product = useMemo(() => {
    return productData?.["Pencil Engraving"];
  }, [id]);

  if (!product)
    return <div className="p-10 text-red-600">Product not found!</div>;

  const price = product.price || 150;

  const handleDownload = async () => {
    setIsPreview(true);
    setTimeout(async () => {
      if (!persImgRef.current) return;
      const canvas = await html2canvas(persImgRef.current, { useCORS: true });
      const link = document.createElement("a");
      link.download = `pencil_${name || "preview"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsPreview(false);
    }, 300);
  };

  const sendToWhatsApp = () => {
    window.open("https://wa.me/919498088659", "_blank");
  };

  const handleAddToCart = async () => {
    if (!name) return toast.error("Please enter a name first");

    try {
      const canvas = await html2canvas(persImgRef.current);
      const imageData = canvas.toDataURL("image/png");

      const productDetails = {
        image: imageData,
        quantity,
        price: price * quantity,
        Name: product.name,
        customName: name,
        productcode: product.productcode,
        datetime: new Date().toISOString(),
      };

      const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];
      existingCart.push(productDetails);
      localStorage.setItem("OrderData", JSON.stringify(existingCart));

      addToCart();
      toast.success("Added to cart!");
      navigate("/Order");
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <div className="sticky top-4">
        <PencilNamePreview
          config={{ background: product.source }}
          studentDetails={{ name }}
          labelTransforms={labelTransforms}
          persImgContRef={persImgRef}
          isPreview={isPreview}
        />
      </div>

      <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <header>
          <h2 className="text-2xl font-bold text-[#12345A]">
            Personalize Pencils
          </h2>
          <p className="text-gray-500 text-sm">
            Enter the name to be printed on all pencils
          </p>
        </header>

        <EditableInput
          fieldKey="name"
          label="Enter Student Name"
          value={name}
          onChange={(v) => setName(v)}
          labelTransforms={labelTransforms}
          setLabelTransforms={setLabelTransforms}
        />

        <hr className="border-gray-100" />

        <CheckoutSection
          price={price}
          quantity={quantity}
          setQuantity={setQuantity}
          showExtraSheet={false}
          showLabelSize={false}
          showLabelType={false}
          handleAddToCart={handleAddToCart}
          handleDownload={handleDownload}
          sendToWhatsApp={sendToWhatsApp}
        />
      </div>
    </main>
  );
};

export default CustomPencil;
