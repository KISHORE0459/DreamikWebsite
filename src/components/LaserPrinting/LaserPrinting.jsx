import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js";
import { CartContext } from "../CartContext";
import CheckoutSection from "../../AppComponents/AppCartComps/CheckoutSection";

const LaserPrinting = () => {
  const persImgContRef = useRef(null);
  const navigate = useNavigate();
  const { productcode } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState({});
  const [price, setPrice] = useState(500);
  const [quantity, setQuantity] = useState(1);

  const [labelType, setLabelType] = useState("Glossy");
  const [labelSize, setLabelSize] = useState(
    "Medium - (100mm * 44 mm) 12 labels - 36nos"
  );

  const [extraSheet, setExtraSheet] = useState(false);
  const [extra, setExtra] = useState("");

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/products.json");
        const data = await res.json();
        const key = "Inkjet/Laser printer";

        if (data[key]) {
          setProduct(data[key]);
          document.title = data[key].name;
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  /* ---------------- EXTRA SHEET ---------------- */
  const handleExtraSheet = useCallback(() => {
    setExtraSheet((prev) => {
      const next = !prev;
      setExtra(next ? " + OneSheet totally 48nos" : "");
      setPrice(next ? price + 40 : product.price || price);
      return next;
    });
  }, [price, product.price]);

  /* ---------------- WHATSAPP ---------------- */
  const sendToWhatsApp = () => {
    const phoneNumber = "919498088659";
    const message = " ";
    window.location.href = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async () => {
    if (!persImgContRef.current) return;

    try {
      const canvas = await html2canvas(persImgContRef.current);
      const imageData = canvas.toDataURL("image/png");

      const productDetails = {
        image: imageData,
        quantity,
        price: price * quantity,
        Name: product.name,
        labeltype: labelType,
        size: `${labelSize}${extra}`,
        labels: [],
        productcode: product.productcode,
      };

      const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];
      existingCart.push(productDetails);
      localStorage.setItem("OrderData", JSON.stringify(existingCart));

      addToCart();
      alert("Product added to cart successfully!");
      navigate("/Order");
    } catch (err) {
      console.error("html2canvas error:", err);
    }
  };

  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = async () => {
    if (!persImgContRef.current) return;

    try {
      const canvas = await html2canvas(persImgContRef.current, {
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "personalized-image.png";
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* LEFT PREVIEW */}
      <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
        <div ref={persImgContRef} className="bg-white rounded-xl shadow-md p-4">
          <img
            src="/image/laserprinter.png"
            alt="Laser Printer"
            className="w-full max-w-md mx-auto"
          />
        </div>

        <h3 className="text-lg font-semibold text-center">
          A4 glossy 120GSM precut sticker (6x2) Blank inkjet printable
        </h3>

        <span className="text-gray-600 text-sm">
          {labelSize}
          {extra}
        </span>
      </div>

      {/* RIGHT CHECKOUT */}
      <div className="w-full lg:w-1/2">
        <CheckoutSection
          title="Product Customization"
          price={price * quantity}
          quantity={quantity}
          setQuantity={setQuantity}
          showLabelType={true}
          labelType={labelType}
          setLabelType={setLabelType}
          labelTypeOptions={[{ label: "Glossy", value: "Glossy" }]}
          showLabelSize={true}
          labelSize={labelSize}
          setLabelSize={setLabelSize}
          labelSizeOptions={[
            {
              label: "Medium - (100mm * 44 mm) 12 labels - 36nos",
              value: "Medium - (100mm * 44 mm) 12 labels - 36nos",
            },
          ]}
          showExtraSheet={true}
          extraSheet={extraSheet}
          setExtraSheet={handleExtraSheet}
          extraSheetPrice={40}
          handleAddToCart={handleAddToCart}
          handleDownload={handleDownload}
          sendToWhatsApp={sendToWhatsApp}
          onBack={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default LaserPrinting;
