import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductOffer from "../Productoffer/Productoffer";
import { useCouponContext } from "../adminpanel/CouponContext";
import axios from "axios";
import ProductDescription from "../../AppComponents/NameSlipComps/ProductDescription";
import { apiEndPoint } from "../../appConfig";

const ProductDetails = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState(null);

  const { coupons, setCoupons } = useCouponContext();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch main product JSON
        const productRes = await fetch("/cutoutnameslip_data.json");
        const productJson = await productRes.json();

        const key = localStorage.getItem("keyid");
        if (key && productJson[key]) {
          setProduct(productJson[key]);
          document.title = productJson[key].name;
        }

        // Fetch offers
        const offersRes = await fetch("/offer.json");
        const offersJson = await offersRes.json();
        setOffers(offersJson?.cutoutnameslips);

        // Fetch coupons
        const couponRes = await axios.get(`${apiEndPoint}/api/coupons`);
        setCoupons(Array.isArray(couponRes.data) ? couponRes.data : []);
      } catch (err) {
        console.error("Error loading details:", err);
      }
    };

    loadData();
  }, []);

  const handlePersonalizeAndAddToCart = (id, template, productcode) => {
    localStorage.removeItem("editedproduct");
    navigate(`/${template}/${productcode}`);
  };

  if (!product || !offers) {
    return <div className="p-10 text-center text-lg">Loading...</div>;
  }

  const end = new Date(offers?.end_time || null);
  const now = new Date();
  const diffInSeconds = (end - now) / 1000;

  return (
    <section className="flex flex-col gap-[30px] px-4! py-8!">
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LEFT - Main image */}
        <div className="col-span-12 lg:col-span-5 px-2!">
          <div className="bg-white rounded overflow-hidden">
            <div className="w-full max-h-[420px] bg-gray-50 flex items-center justify-center">
              <img
                src={product.source}
                alt={product.name}
                className="w-full h-auto object-contain max-h-[420px]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT - Product details */}
        <div className="col-span-12 lg:col-span-7">
          <ProductDescription
            product={product}
            secondsLeft={diffInSeconds}
            showHighlights={true}
            showMatteAndGlossy={false}
            onAddToCart={() =>
              handlePersonalizeAndAddToCart(
                product.id,
                product.template,
                product.productcode
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
