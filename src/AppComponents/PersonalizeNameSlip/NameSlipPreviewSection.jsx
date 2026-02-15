"use client";

import Box from "@mui/material/Box";
import useBreakpointValue from "../../AppHooks/useBreakPointValues";

const NameSlipPreviewSection = ({
  config,
  product,
  selectedImage,
  labelTransforms,
  studentDetails,
  brightness,
  contrast,
  imageBorder,
  circleImage,
  imageTransforms,
  persImgContRef,
  isPreview = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const selectedWatermark =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedlabel")
      : null;

  const effectiveWatermark = (() => {
    if (!config?.watermark?.enabled) return null;

    if (!config?.watermarkOverrides || !selectedWatermark) {
      return { ...config?.watermark, src: selectedWatermark };
    }

    const override = config?.watermarkOverrides[selectedWatermark];

    if (override) {
      return {
        ...config?.watermark,
        ...override,
        src: selectedWatermark,
      };
    }

    return { ...config.watermark, src: selectedWatermark };
  })();

  const renderLabel = (key, text) => {
    const labelConfig = config?.labels[key];
    if (!labelConfig) return null;

    if (labelConfig?.hidden) return null;

    const trans = labelTransforms[key + "Trans"];

    return (
      <h3
        className="absolute font-semibold select-none"
        style={{
          top: labelConfig?.top,
          left: labelConfig?.left,
          fontSize: isMobile ? "15px" : "27px",
          lineHeight: "1",
          padding: 0,
          margin: 0,
          display: "inline-block",
          color: trans?.color,
          fontFamily: trans?.fontFamily || "Arial",
          transformOrigin: "0 0", // ✅ CRITICAL
          transform: `
      translate(${trans?.translateX}px, ${isPreview ? trans?.translateY - 15 : trans?.translateY}px)
      scale(${trans?.scale})
      rotate(${trans?.rotate}deg)
      scaleX(${trans?.mirror})
    `,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </h3>
    );
  };

  const renderUserImage = () => {
    if (!config?.image?.enabled || !selectedImage) return null;

    const imgCfg = config?.image;

    return (
      <img
        src={selectedImage}
        alt="uploaded"
        className="absolute"
        style={{
          top: imgCfg?.top,
          left: imgCfg?.left,
          width: imgCfg?.width,
          maxWidth: imgCfg?.maxWidth,
          maxHeight: imgCfg?.maxHeight,

          // shape rules
          borderRadius: circleImage
            ? "9999px"
            : imgCfg?.shape === "circle"
              ? "9999px"
              : "4px",

          border: imageBorder ? "2px solid black" : "none",
          // filters
          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          // transforms
          transform: `
            scale(${imageTransforms?.scale})
            rotate(${imageTransforms?.rotate}deg)
            translate(${imageTransforms?.translateX}px, ${imageTransforms?.translateY}px)
            scaleX(${imageTransforms?.mirror})
          `,

          transition: "transform 0.15s linear",
        }}
      />
    );
  };

  return (
    <Box
      ref={persImgContRef}
      className="relative w-full h-fit rounded-xl overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
    >
      {/* Background Template */}
      <img
        src={product?.source || config?.background}
        alt="template"
        className="w-full h-auto object-cover"
      />

      {/* User Image */}
      {renderUserImage()}

      {/* Labels */}
      {renderLabel("name", studentDetails?.name)}
      {renderLabel("school", studentDetails?.schoolName)}
      {renderLabel("subject", studentDetails?.subject)}
      {renderLabel("roll", studentDetails?.rollNumber)}
      {renderLabel("section", studentDetails?.section)}
      {renderLabel("class", studentDetails?.class)}

      {/* Watermark */}
      {effectiveWatermark && (
        <img
          src={effectiveWatermark?.src}
          alt="watermark"
          className="absolute pointer-events-none select-none w-full h-full"
          style={{
            top: effectiveWatermark?.top,
            left: effectiveWatermark?.left,
            // opacity: effectiveWatermark.opacity ?? 1,
            // width: effectiveWatermark.width || "30%",
          }}
        />
      )}
    </Box>
  );
};

export default NameSlipPreviewSection;
