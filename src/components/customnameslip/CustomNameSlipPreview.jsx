const CustomNameSlipPreview = ({
  previewRef,
  backgroundImage,
  selectedImage,
  imageBorder,
  circleImage,
  brightness,
  contrast,
  transformations,
  studentDetails,
  labelTransforms,
  config,
}) => {
  return (
    <div ref={previewRef} className="relative w-full overflow-hidden">
      {/* BACKGROUND */}
      <img
        src={backgroundImage}
        alt="background"
        className="w-full h-auto object-contain pointer-events-none select-none"
      />

      {/* USER IMAGE */}
      {selectedImage && (
        <img
          src={selectedImage}
          alt="user"
          className={`absolute z-10 object-cover
            ${imageBorder ? "border-2 border-black" : ""}
            ${circleImage ? "rounded-full" : "rounded-md"}
          `}
          style={{
            top: 0,
            left: 0,
            width: `${transformations.width}px`,
            height: `${transformations.height}px`,
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            transform: `
              translate(${transformations.translateX}px, ${transformations.translateY}px)
              rotate(${transformations.rotate}deg)
              scale(${transformations.scale})
              scaleX(${transformations.mirror})
            `,
          }}
        />
      )}

      {/* TEXT FIELDS — SAME MODEL AS CUTOUT */}
      {Object.entries(config.labels).map(([key, base]) => {
        const text = studentDetails[key];
        if (!text) return null;

        const transKey =
          key === "schoolName"
            ? "schoolTrans"
            : key === "rollNumber"
            ? "rollTrans"
            : `${key}Trans`;

        const trans = labelTransforms[transKey];
        if (!trans) return null;

        return (
          <span
            key={key}
            className="absolute select-none"
            style={{
              top: base.top, // 🔒 TEMPLATE
              left: base.left, // 🔒 TEMPLATE
              fontSize: `${trans.fontSize}px`,
              fontFamily: trans.fontFamily,
              color: trans.color,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 20,
              transform: `
                translate(${trans.translateX}px, ${trans.translateY}px)  /* ✅ ARROWS */
                rotate(${trans.rotate}deg)
                scale(${trans.scale})
                scaleX(${trans.mirror})
              `,
              transition: "transform 0.12s linear",
            }}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
};

export default CustomNameSlipPreview;
