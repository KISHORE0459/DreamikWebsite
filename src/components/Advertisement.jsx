import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import { CiStar } from "react-icons/ci";

function Advertisement() {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const fetchAdvertisementData = async () => {
      try {
        const response = await fetch("../advertisments.json");
        if (!response.ok) throw new Error("Failed to fetch advertisements");
        const data = await response.json();
        setAdvertisements(data);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      }
    };

    fetchAdvertisementData();
  }, []);

  return (
    <div className="w-full h-[30px] bg-[#3E9D62] text-white flex items-center overflow-hidden">
      <Swiper
        modules={[Autoplay, FreeMode]}
        loop={true}
        freeMode={true}
        slidesPerView="auto"
        speed={6000}
        spaceBetween={40}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full"
      >
        {advertisements.map((ad, index) => (
          <SwiperSlide
            key={index}
            style={{
              width: "auto",
            }}
          >
            <a
              href={ad.link}
              className="flex items-center! gap-1 text-[12px] md:text-[14px] hover:font-medium"
            >
              <CiStar className="w-5 h-5 fill-white" />
              {ad.message}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Advertisement;
