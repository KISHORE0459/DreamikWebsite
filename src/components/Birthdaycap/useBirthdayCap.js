import { useState, useMemo } from "react";

export const useBirthdayCap = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerUnit = 100;

  const [studentName, setStudentName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [imageTransforms, setImageTransforms] = useState({
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    mirror: 1,
  });

  const [nameTrans, setNameTrans] = useState({
    fontSize: 18,
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    mirror: 1,
    color: "#1A1A1A",
  });

  const totalPrice = useMemo(() => quantity * pricePerUnit, [quantity]);

  return {
    quantity,
    setQuantity,

    totalPrice,

    studentName,
    setStudentName,

    selectedImage,
    setSelectedImage,

    imageTransforms,
    setImageTransforms,

    nameTrans,
    setNameTrans,
  };
};
