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
  nameTrans,
  schooltrans,
  subjecttrans,
  rollnotrans,
  sectiontrans,
  classtrans,
}) => {
  const fields = [
    { key: "name", trans: nameTrans },
    { key: "class", trans: classtrans },
    { key: "section", trans: sectiontrans },
    { key: "rollNumber", trans: rollnotrans },
    { key: "subject", trans: subjecttrans },
    { key: "schoolName", trans: schooltrans },
  ];

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

      {/* TEXT FIELDS */}
      {fields.map(({ key, trans }) => {
        const text = studentDetails[key];
        if (!text) return null;

        return (
          <span
            key={key}
            style={{
              position: "absolute",
              top: `${trans.top}%`,
              left: `${trans.left}%`,
              fontSize: `${trans.fontSize}px`,
              fontFamily: trans.fontFamily || "Arial",
              color: trans.color || "#000",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 20,
              transform: `
                rotate(${trans.rotate}deg)
                scale(${trans.scale})
                scaleX(${trans.mirror})
              `,
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
