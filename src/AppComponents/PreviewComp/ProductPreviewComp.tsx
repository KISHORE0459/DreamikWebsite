import { useState, useEffect } from "react";

const ProductPreviewComp = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 sec

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return <p>No images provided.</p>;

  return (
    <div className="mt-8 border! border-[#464545] rounded-lg p-5! flex flex-col gap-5!">
      <h3 className="text-[18px]! font-semibold! text-[#1A1A1A]! leading-5!">
        Product Preview
      </h3>

      <div className="flex justify-center mb-6">
        <img
          src={images[selectedIndex]}
          alt="main-display"
          width={210} // was 350 → 40% smaller
          height={210}
          className="rounded-xl shadow object-cover"
        />
      </div>

      {/* SCROLLABLE THUMB STRIP */}
      <div className="w-full flex justify-center items-center">
        <div className="overflow-x-auto overflow-y-hidden py-4! px-5! custom-scrollbar">
          <div className="flex gap-4">
            {images.map((src, i) => (
              <div
                className={`${
                  selectedIndex == i
                    ? "border-3! border-blue-600! rounded-lg!"
                    : ""
                } p-1! w-[100px] h-[150px] shrink-0`}
              >
                <img
                  key={i}
                  src={src}
                  alt={`label-${i}`}
                  width={72} // was 120 → reduced 40%
                  height={72}
                  onClick={() => setSelectedIndex(i)}
                  className={`
                w-full h-full object-cover rounded-lg shadow cursor-pointer transition-all opacity-80
                ${selectedIndex === i ? "opacity-100 scale-105" : ""}
                `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewComp;
