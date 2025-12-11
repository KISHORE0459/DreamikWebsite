import { useRef, useEffect } from "react";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { IoMdArrowDroprightCircle } from "react-icons/io";

const NameSlipFramePicker = ({
  frames = [],
  currentIndex = 0,
  onSelect = () => {},
  onPrev = () => {},
  onNext = () => {},
}) => {
  const containerRef = useRef(null);
  const thumbRefs = useRef([]);

  // Scroll selected frame into view automatically
  useEffect(() => {
    if (thumbRefs.current[currentIndex]) {
      thumbRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  if (!frames || frames.length === 0) return null;

  return (
    <div className="px-4 py-3 w-full">
      <div className="flex items-center justify-between h-[50px]">
        <h3 className="text-[18px]! font-medium! text-[#1A1A1A]! leading-4!">
          Select name frame
        </h3>

        <div className="flex gap-2">
          <IoMdArrowDropleftCircle
            onClick={onPrev}
            className="w-[30px] h-[30px] hover:cursor-pointer!"
          />
          <IoMdArrowDroprightCircle
            onClick={onNext}
            className="w-[30px] h-[30px] hover:cursor-pointer!"
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className={`flex gap-3 h-[120px]! overflow-x-auto py-2! px-4! custom-scrollbar`}
        style={{ scrollBehavior: "smooth" }}
      >
        {frames.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumb-${index}`}
            ref={(el) => (thumbRefs.current[index] = el)}
            onClick={() => onSelect(img, index)}
            className={`w-28 h-20 object-cover rounded cursor-pointer flex-shrink-0 transition-transform ${
              index === currentIndex
                ? "ring-2 ring-indigo-500 scale-105"
                : "border"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NameSlipFramePicker;
