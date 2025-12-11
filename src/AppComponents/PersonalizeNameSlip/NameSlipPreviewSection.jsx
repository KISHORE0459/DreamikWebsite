"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const NameSlipPreviewSection = ({
  config, // template config (from JSON)
  product, // background template image
  selectedImage, // user uploaded image
  labelTransforms, // { nameTrans, schoolTrans, subjectTrans, ... }
  studentDetails, // { name, schoolName, subject, class, section }
  brightness,
  contrast,
  imageBorder,
  circleImage,
  imageTransforms, // zoom, rotate, translate, mirror
  persImgContRef, // ref for html2canvas
}) => {
  const renderLabel = (key, value) => {
    if (!config?.labels?.[key]) return null;

    const pos = config.labels[key];
    const trans = labelTransforms[key + "Trans"];

    return (
      <Typography
        key={key}
        variant="body1"
        className="absolute font-bold shadow-text select-none"
        style={{
          top: pos.top,
          left: pos.left,
          fontSize: `${trans.fontSize}px`,
          color: trans.color,
          fontFamily: trans.fontFamily || "Arial",
          transform: `
            scale(${trans.scale}) 
            rotate(${trans.rotate}deg)
            translate(${trans.translateX}px, ${trans.translateY}px)
            scaleX(${trans.mirror})
          `,
          transition: "transform 0.15s linear",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
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

      {/* User Image (if template allows) */}
      {config.image?.enabled && selectedImage && (
        <img
          src={selectedImage}
          alt="uploaded"
          className="absolute"
          style={{
            top: config.image.top,
            left: config.image.left,
            width: config.image.width,
            maxWidth: config.image.maxWidth,
            maxHeight: config.image.maxHeight,
            border: imageBorder ? "2px solid black" : "none",
            borderRadius: circleImage
              ? "9999px"
              : config.image.shape === "circle"
              ? "9999px"
              : "4px",
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            transform: `
              scale(${imageTransforms.scale})
              rotate(${imageTransforms.rotate}deg)
              translate(${imageTransforms.translateX}px, ${imageTransforms.translateY}px)
              scaleX(${imageTransforms.mirror})
            `,
            transition: "transform 0.15s linear",
          }}
        />
      )}

      {/* Render Labels Dynamically */}
      {renderLabel("name", studentDetails.name)}
      {renderLabel("school", studentDetails.schoolName)}
      {renderLabel("subject", studentDetails.subject?.join(", "))}
      {renderLabel("roll", studentDetails.rollNumber)}
      {renderLabel("section", studentDetails.section)}
      {renderLabel("class", studentDetails.class)}

      {/* Watermark */}
      {config.watermark?.enabled && (
        <img
          src={config.watermark.src}
          className="absolute pointer-events-none select-none"
          style={{
            top: config.watermark.top,
            left: config.watermark.left,
            opacity: config.watermark.opacity,
            width: config.watermark.width || "30%",
          }}
          alt="watermark"
        />
      )}
    </Box>
  );
};

export default NameSlipPreviewSection;
