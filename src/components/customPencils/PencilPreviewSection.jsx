"use client";

import Box from "@mui/material/Box";
import useBreakpointValue from "../../AppHooks/useBreakPointValues";
import PencilImage from "../../../public/pencil/PencilImage.png";

const PencilNamePreview = ({
  config,
  studentDetails,
  labelTransforms,
  persImgContRef,
  isPreview = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const trans = labelTransforms?.nameTrans;
  const userName = studentDetails?.name || "YOUR NAME";

  const pencilPositions = [
    8.5, 12.3, 16, 19.8, 23.5, 27.2, 31, 34.7, 38.5, 42.2, 57.2, 61, 64.7, 68.5,
    72.2, 76, 79.7, 83.5, 87.2, 91,
  ];

  const renderNameOnPencil = (leftPos, index) => {
    return (
      <div
        key={index}
        className="absolute font-bold select-none whitespace-nowrap"
        style={{
          top: "45%",
          left: `${leftPos}%`,
          fontSize: isMobile ? "8px" : "14px",
          color: trans?.color || "#333",
          fontFamily: trans?.fontFamily || "Arial",
          transformOrigin: "center center",
          transform: `
            translate(-50%, -50%) 
            translate(${trans?.translateX || 0}px, ${isPreview ? (trans?.translateY || 0) - 10 : trans?.translateY || 0}px)
            rotate(${(trans?.rotate || 0) - 90}deg)
            scale(${trans?.scale || 1})
            scaleX(${trans?.mirror || 1})
          `,
          mixBlendMode: "multiply",
          opacity: 0.9,
        }}
      >
        {userName}
      </div>
    );
  };

  return (
    <Box
      ref={persImgContRef}
      className="relative w-full h-auto rounded-lg overflow-hidden bg-white shadow-lg"
    >
      <img
        src={PencilImage}
        alt="Pencil Template"
        className="w-full h-auto block"
      />
      <div className="absolute inset-0 pointer-events-none">
        {pencilPositions.map((pos, idx) => renderNameOnPencil(pos, idx))}
      </div>
    </Box>
  );
};

export default PencilNamePreview;
