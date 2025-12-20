import { useState } from "react";
import Image1 from "../../../public/BirthdaycapImages/birthdaycap1.webp";
import Image2 from "../../../public/BirthdaycapImages/birthdaycap2.webp";

const birthdayCapDesigns = [
  {
    id: "cap-1",
    label: "Classic Cap",
    image: Image1,
    imageStyle: {
      top: "40%",
      left: "55%",
      width: "90px",
      height: "90px",
      rotate: 10,
    },
    bgCurveStyle: {
      top: "53%",
      left: "60%",
      rotate: -25,
      svgWidth: 260,
      svgHeight: 70,
      strokeWidth: 38,
      curvePath: "M 10 10 Q 130 90, 250 10",
    },
    textStyle: {
      top: "55%",
      left: "60%",
      rotate: -25,
      svgWidth: 260,
      svgHeight: 70,
      curvePath: "M 10 10 Q 130 90, 250 10",
    },
  },
  {
    id: "cap-2",
    label: "Party Cap",
    image: Image2,
    imageStyle: {
      top: "40%",
      left: "48%",
      width: "60px",
      height: "60px",
      rotate: 35,
    },
    bgCurveStyle: {
      top: "48%",
      left: "52%",
      rotate: -2,
      svgWidth: 260,
      svgHeight: 70,
      strokeWidth: 30,
      curvePath: "M 10 10 Q 130 90, 250 10",
    },
    textStyle: {
      top: "50%",
      left: "52%",
      rotate: -2,
      svgWidth: 260,
      svgHeight: 70,
      curvePath: "M 10 10 Q 130 90, 250 10",
    },
  },
];

const BirthdayCapCanvas = ({
  previewRef,
  selectedImage,
  imageTransforms,
  studentName,
  nameTrans,
}) => {
  const [activeImage, setActiveImage] = useState(birthdayCapDesigns[0]);

  const { image, imageStyle, textStyle, bgCurveStyle } = activeImage;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={previewRef}
        className="relative w-[300px] md:w-[550px] h-[300px] md:h-[500px] flex items-start"
      >
        <div className="w-[300px] md:w-[550px]">
          <img src={image} className="w-full h-auto" />
        </div>
        <svg
          className="absolute z-10 pointer-events-none"
          style={{
            top: bgCurveStyle.top,
            left: bgCurveStyle.left,
            transform: `translateX(-50%) rotate(${bgCurveStyle.rotate}deg)`,
          }}
          width={bgCurveStyle.svgWidth}
          height={bgCurveStyle.svgHeight}
        >
          <path
            d={bgCurveStyle.curvePath}
            fill="none"
            stroke="#ffffff"
            strokeWidth={bgCurveStyle.strokeWidth}
            strokeLinecap="round"
          />
        </svg>
        {selectedImage && (
          <img
            src={selectedImage}
            className="absolute z-20"
            style={{
              top: imageStyle.top,
              left: imageStyle.left,
              width: imageStyle.width,
              height: imageStyle.height,
              transform: `
                translate(-50%, -50%)
                scale(${imageTransforms.scale})
                rotate(${imageTransforms.rotate + imageStyle.rotate}deg)
                translate(${imageTransforms.translateX}px, ${
                imageTransforms.translateY
              }px)
                scaleX(${imageTransforms.mirror})
              `,
            }}
          />
        )}
        <svg
          className="absolute z-30 pointer-events-none"
          style={{
            top: textStyle.top,
            left: textStyle.left,
            transform: `translateX(-50%) rotate(${textStyle.rotate}deg)`,
          }}
          width={textStyle.svgWidth}
          height={textStyle.svgHeight}
        >
          <defs>
            <path id={`curve-${activeImage.id}`} d={textStyle.curvePath} />
          </defs>

          <text
            fill={nameTrans.color}
            style={{
              fontSize: nameTrans.fontSize,
              transform: `
                scale(${nameTrans.scale})
                rotate(${nameTrans.rotate}deg)
                translate(${nameTrans.translateX}px, ${nameTrans.translateY}px)
                scaleX(${nameTrans.mirror})
              `,
            }}
          >
            <textPath
              href={`#curve-${activeImage.id}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {studentName}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="flex gap-4 justify-center">
        {birthdayCapDesigns.map((design) => (
          <button
            key={design.id}
            onClick={() => setActiveImage(design)}
            className={`border! rounded-lg p-2 transition-all bg-white!
              ${
                activeImage.id === design.id
                  ? "border-green-600! shadow-md"
                  : "border-gray-300! hover:border-gray-500!"
              }`}
          >
            <img src={design.image} className="w-20 h-auto" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BirthdayCapCanvas;
