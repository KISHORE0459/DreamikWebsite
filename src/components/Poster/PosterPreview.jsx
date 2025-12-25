"use client";

const PosterPreview = ({
  background,
  watermark,
  selectedImage,
  imageTransforms,
  imageBorder,
  circleImage,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "300px",
        height: "450px",
        backgroundColor: "#ffffff",
        border: "2px solid #cccccc",
        overflow: "hidden",
        fontFamily: "Arial",
      }}
    >
      {/* BACKGROUND */}
      <img
        src={background}
        alt="Poster background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* USER IMAGE */}
      {selectedImage && (
        <img
          src={selectedImage}
          alt="User upload"
          style={{
            position: "absolute",
            width: "60%",
            height: "40%",
            top: "30%",
            left: "20%",
            transform: `
              translate(${imageTransforms.translateX}px,
                        ${imageTransforms.translateY}px)
              scale(${imageTransforms.scale})
              rotate(${imageTransforms.rotate}deg)
              scaleX(${imageTransforms.mirror})
            `,
            transition: "transform 0.15s linear",
            border: imageBorder ? "2px solid #000000" : "none",
            borderRadius: circleImage ? "9999px" : "0px",
            backgroundColor: "#ffffff",
          }}
        />
      )}

      {/* WATERMARK */}
      {watermark && (
        <img
          src={watermark}
          alt="Watermark"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default PosterPreview;
