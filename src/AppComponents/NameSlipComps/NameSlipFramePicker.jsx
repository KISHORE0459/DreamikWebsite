import { useRef, useEffect } from "react";

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
      {/* Header + Buttons */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[18px]! font-medium text-[#1A1A1A]! leading-4!">
          Select name frame
        </h3>

        <div className="flex gap-2">
          <button
            onClick={onPrev}
            aria-label="prev"
            className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
          >
            ◀
          </button>

          <button
            onClick={onNext}
            aria-label="next"
            className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-3 h-[120px]! overflow-x-auto py-2! px-3!"
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
