// Products.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import ProductDescription from "../../AppComponents/NameSlipComps/ProductDescription";
import NameSlipFramePicker from "../../AppComponents/NameSlipComps/NameSlipFramePicker";
import ProductPreviewComp from "../../AppComponents/PreviewComp/ProductPreviewComp";

const Products = () => {
  const { productcode } = useParams();
  const navigate = useNavigate();

  // Core states
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offers, setOffers] = useState(null);

  // refs for thumbnail scrolling
  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  // --- Fetching data (nameslip_data + offers)
  useEffect(() => {
    const fetchNameslipData = async () => {
      try {
        const res = await fetch("/nameslip_data.json");
        if (!res.ok) throw new Error("Nameslip fetch failed");
        const data = await res.json();
        localStorage.setItem("data", JSON.stringify(data));
        return data;
      } catch (err) {
        console.error("Nameslip fetch error:", err);
        return null;
      }
    };

    const loadProduct = async () => {
      const data = await fetchNameslipData();
      if (!data) return;

      const NSHLT = productcode?.startsWith?.("NSHLT");
      const extractedId = NSHLT
        ? 118 + parseInt(productcode.slice(-3), 10)
        : productcode.slice(-3);

      const productData = data[extractedId] || data[parseInt(extractedId, 10)];
      if (!productData) {
        console.warn("Product not found for id:", extractedId);
        return;
      }
      setProduct(productData);
      document.title = productData.name || "Product";
      localStorage.setItem("keyid", extractedId);

      // set default mainImage if product has gallery
      if (productData.gallery && productData.gallery.length > 0) {
        setMainImage(productData.gallery[0]);
        setCurrentIndex(0);
      } else if (productData.source) {
        setMainImage(productData.source);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await fetch("/offer.json");
        if (!res.ok) throw new Error("Offers fetch failed");
        const data = await res.json();
        setOffers(data.nameslips);
      } catch (err) {
        console.error("Offers fetch error:", err);
        setOffers(null);
      }
    };

    fetchOffers();
    loadProduct();
  }, [productcode]);

  // --- Gallery controls ---
  const handleImageChange = (imgSrc, idx) => {
    setMainImage(imgSrc);
    setCurrentIndex(idx);
    const el = thumbnailRefs.current[idx];
    if (el && thumbnailContainerRef.current) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const nextImage = () => {
    if (!product?.gallery?.length) return;
    const newIndex =
      currentIndex === product.gallery.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setMainImage(product.gallery[newIndex]);
  };

  const prevImage = () => {
    if (!product?.gallery?.length) return;
    const newIndex =
      currentIndex === 0 ? product.gallery.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setMainImage(product.gallery[newIndex]);
  };

  // --- Personalize & add to cart (keeps your logic) ---
  const handlePersonalizeAndAddToCart = (id, template, productcodeParam) => {
    localStorage.removeItem("editedproduct");

    if (template === "template11" || template === "template12") {
      const selectedlabel = mainImage
        ? mainImage
        : "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT03.png";
      localStorage.setItem("selectedlabel", selectedlabel);
    } else {
      const selectedlabel = mainImage ? mainImage : "/image/waterlabel.png";
      localStorage.setItem("selectedlabel", selectedlabel);
    }

    localStorage.setItem("keyid", id);
    navigate(`/name-slip/${template}/${productcodeParam}`);
  };

  // --- Helpers for mask src & offer calculation ---
  const getMaskSrc = () => {
    if (mainImage) return mainImage;
    if (
      product?.template === "template11" ||
      product?.template === "template12"
    ) {
      return "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT03.png";
    }
    const skipDefault = [
      "template2",
      "template4",
      "template5",
      "template6",
      "template1",
      "template7",
      "template10",
    ];
    if (skipDefault.includes(product?.template)) return "";
    return "/image/waterlabel.png";
  };

  const maskSrc = getMaskSrc();

  const displayPrice = offers?.original_price_matte ?? 100;
  const discount = offers?.offer_percentage_matte ?? 0;
  const finalPrice = discount
    ? Math.round(displayPrice - (displayPrice * discount) / 100)
    : displayPrice;

  const now = new Date();
  const endTime = offers?.end_time ? new Date(offers.end_time) : null;
  const secondsLeft = endTime
    ? Math.max(0, Math.floor((endTime - now) / 1000))
    : null;

  // --- Guard: product not yet loaded ---
  if (!product) {
    return (
      <div className="w-full min-h-[240px] flex items-center justify-center p-8">
        <Typography variant="h6">Loading product...</Typography>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-[30px] px-4! py-8!">
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-5 px-2!">
          <div className="bg-white rounded overflow-hidden flex flex-col gap-10!">
            <div className="w-full max-h-[420px] bg-gray-50">
              {/* Container to keep main label size stable */}
              <div className="relative w-full max-h-[420px] flex items-center justify-center">
                {/* Base product source */}
                <img
                  src={product.source}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-[420px]"
                />
                {/* mask overlay if available */}
                {maskSrc ? (
                  <img
                    src={maskSrc}
                    alt="mask"
                    className={`absolute left-0 top-0 w-full h-full object-contain pointer-events-none`}
                    style={
                      {
                        // if you need special tweaks for certain images, adjust here
                        // e.g. mask-label-special styles can be set dynamically
                      }
                    }
                  />
                ) : null}
              </div>
            </div>
            <NameSlipFramePicker
              frames={product.gallery}
              currentIndex={currentIndex}
              onSelect={(img, idx) => handleImageChange(img, idx)}
              onPrev={prevImage}
              onNext={nextImage}
            />
          </div>
        </div>

        {/* RIGHT: product info (5 columns) */}
        <div className="col-span-12 lg:col-span-7">
          <ProductDescription
            product={product}
            secondsLeft={secondsLeft}
            onAddToCart={() =>
              handlePersonalizeAndAddToCart(
                product.id,
                product?.template,
                product.productcode
              )
            }
            showHighlights={true}
            showMatteAndGlossy={true}
          />
        </div>
      </div>
      <ProductPreviewComp
        images={Array.from({ length: 12 }).map(
          (_, i) => `/image/Nsdemo/Nsdemo${(i % 3) + 1}.jpeg`
        )}
      />
    </section>
  );
};

export default Products;
