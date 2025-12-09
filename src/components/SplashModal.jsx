import { useEffect } from "react";
import Slider from "react-slick";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SplashModal = ({ visible, setVisible }) => {
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [visible]);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const splashcontent = [
    "/splashscreenImages/splashscreenimage.webp",
    "/splashscreenImages/sampleimage1.webp",
    "/splashscreenImages/sampleimage2.webp",
    "/splashscreenImages/splashvideo1.mp4",
    "/splashscreenImages/splashvideo2.mp4",
  ];

  return (
    <Modal
      open={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="splash-modal"
      className="flex items-center justify-center backdrop-blur-sm"
    >
      <Box
        className="
          bg-white rounded-xl shadow-2xl p-5 w-[90%] md:w-[70%] lg:w-[50%] 
          max-h-[90vh] overflow-y-auto relative
        "
      >
        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="
            absolute top-3 right-3 bg-red-500 hover:bg-red-600 
            text-white px-3 py-1 rounded-full text-sm transition
          "
        >
          ✖
        </button>

        {/* Slider */}
        <div className="w-full max-w-2xl mx-auto mt-6">
          <Slider {...settings}>
            {splashcontent.map((src, i) => {
              const isVideo = src.endsWith(".mp4");
              return (
                <div key={i} className="flex justify-center">
                  {isVideo ? (
                    <video
                      src={src}
                      autoPlay
                      muted
                      loop
                      className="rounded-xl w-full max-h-[400px] object-contain"
                    />
                  ) : (
                    <img
                      src={src}
                      alt={`slide-${i}`}
                      className="rounded-xl w-full max-h-[400px] object-contain"
                    />
                  )}
                </div>
              );
            })}
          </Slider>
        </div>

        {/* Free Gift Offer */}
        <div
          className="
            bg-yellow-50 border-l-4 border-yellow-500 shadow 
            mt-6 p-4 rounded-md text-gray-700 text-sm md:text-base
          "
        >
          <strong className="font-semibold">🎁 Free Gift: </strong>
          Get a <strong>6×4 inch photo print</strong> of any one photo
          absolutely free!
          <br />
          📩 Send your selected photo + your <strong>Order ID</strong> to us via
          <strong> WhatsApp or Email</strong>.
        </div>
      </Box>
    </Modal>
  );
};

export default SplashModal;
