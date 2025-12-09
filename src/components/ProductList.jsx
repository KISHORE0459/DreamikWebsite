import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProductCard from "../AppComponents/AddComps/AddProductCard";
import ProductCard from "../AppComponents/ProductComps/ProductCard";
// swiper js
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const ProductList = ({ searchText, resellerlogin, ResellerProducts }) => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) =>
        setProducts(Array.isArray(data) ? data : Object.values(data))
      )
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    fetch("/offer.json")
      .then((res) => res.json())
      .then((data) => setOffers(data.onePlusOneOffer))
      .catch(console.error);
  }, []);

  const now = new Date();
  const end = new Date(offers?.end_time || null);
  const diffInSeconds = (end - now) / 1000;

  const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();

  const filteredProducts = products.filter((p) =>
    normalize(p.name).includes(normalize(searchText))
  );

  const handleClick = (p) => {
    if (!p) return;
    const url = p.name.replace(/\s+/g, "");
    navigate(`/${url}`);
  };

  return (
    <div className="w-full px-4 md:px-8 mt-2.5! flex flex-col gap-5!">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={15}
        grabCursor={true}
        centeredSlides={false}
        className="w-full py-4 block! lg:hidden!"
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          480: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 6,
          },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <AddProductCard
              product={product}
              resellerLogin={resellerlogin}
              ResellerProducts={ResellerProducts}
              handleClick={handleClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hidden! w-full lg:flex! flex-row items-center justify-center flex-wrap gap-5 py-2 px-2">
        {products.map((product, index) => (
          <AddProductCard
            product={product}
            resellerLogin={resellerlogin}
            ResellerProducts={ResellerProducts}
            handleClick={handleClick}
            key={index}
          />
        ))}
      </div>

      <div
        className="flex flex-row flex-wrap justify-center md:items-stretch
    lg:grid grid-cols-3 2xl:grid-cols-4 gap-5 px-5!
    place-items-center"
      >
        {filteredProducts.map((product, index) => (
          <ProductCard
            product={product}
            resellerLogin={resellerlogin}
            ResellerProducts={ResellerProducts}
            diffInSeconds={diffInSeconds}
            handleClick={handleClick}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
