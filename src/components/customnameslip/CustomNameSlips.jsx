import { useContext, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js";

import { CartContext } from "../CartContext";
import ImagePersonalizationComp from "../../AppComponents/ImageEdit/ImagePersonalizationComp";
import EditableInput from "../../AppComponents/InputEdit/EditableInput";
import { compressImageIfNeeded } from "../imagecompressor/imagecompressor";
import CustomNameSlipPreview from "./CustomNameSlipPreview";
import NameSlipCheckoutSection from "../../AppComponents/PersonalizeNameSlip/NameSlipCheckOutSection";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { FaExpandAlt } from "react-icons/fa";

const CustomNameSlips = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const previewRef = useRef(null);

  /* ---------------- STATE ---------------- */
  const [selectedImage, setSelectedImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(
    "/image/DreamikAILabel-Rectangle-1080x1920px-HD-WhiteBK-Type2-ImageLeft.png"
  );

  const [imageBorder, setImageBorder] = useState(false);
  const [circleImage, setCircleImage] = useState(false);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(100);

  const [labelType, setLabelType] = useState("matte");
  const [labelSize, setLabelSize] = useState(
    "Medium - (100mm × 44mm) 12 labels - 36nos"
  );
  const [extraSheet, setExtraSheet] = useState(false);

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    schoolName: "",
    subject: "",
    rollNumber: "",
    section: "",
    class: "",
  });

  const defaultTransforms = {
    name: {
      fontSize: 38,
      fontFamily: "Arial",
      color: "#000",
      scale: 1,
      rotate: 0,
      top: 18,
      left: 42,
      mirror: 1,
    },
    class: {
      fontSize: 34,
      fontFamily: "Arial",
      color: "#000",
      scale: 1,
      rotate: 0,
      top: 28,
      left: 40,
      mirror: 1,
    },
    section: {
      fontSize: 34,
      fontFamily: "Arial",
      color: "#000",
      scale: 1,
      rotate: 0,
      top: 28,
      left: 62,
      mirror: 1,
    },
    rollNumber: {
      fontSize: 34,
      fontFamily: "Arial",
      color: "#000",
      scale: 1,
      rotate: 0,
      top: 38,
      left: 45,
      mirror: 1,
    },
    subject: {
      fontSize: 34,
      fontFamily: "Arial",
      color: "#000",
      scale: 1,
      rotate: 0,
      top: 48,
      left: 45,
      mirror: 1,
    },
    schoolName: {
      fontSize: 34,
      fontFamily: "Arial",
      color: "#000",
      scale: 1,
      rotate: 0,
      top: 58,
      left: 45,
      mirror: 1,
    },
  };

  const [nameTrans, setNameTrans] = useState(defaultTransforms?.name);
  const [schoolTrans, setSchoolTrans] = useState(defaultTransforms?.schoolName);
  const [subjectTrans, setSubjectTrans] = useState(defaultTransforms?.subject);
  const [rollTrans, setRollTrans] = useState(defaultTransforms?.rollNumber);
  const [sectionTrans, setSectionTrans] = useState(defaultTransforms?.section);
  const [classTrans, setClassTrans] = useState(defaultTransforms?.class);

  const [imageTransforms, setImageTransforms] = useState({
    width: 170, // base image width
    height: 200, // base image height
    scale: 1,
    rotate: 0,
    translateX: 40,
    translateY: 60,
    mirror: 1,
  });

  /* ---------------- HELPERS ---------------- */
  const calcFontSize = (len) => Math.max(36 - len * 0.5, 10);

  const handleInputChange = (key, value) => {
    setStudentDetails((p) => ({ ...p, [key]: value }));
    const size = calcFontSize(value.length);

    const map = {
      name: setNameTrans,
      schoolName: setSchoolTrans,
      subject: setSubjectTrans,
      rollNumber: setRollTrans,
      section: setSectionTrans,
      class: setClassTrans,
    };

    map[key]?.((p) => ({ ...p, fontSize: size }));
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await compressImageIfNeeded(file);
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(compressed);
  };

  /* ---------------- BACKGROUND IMAGE ---------------- */
  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBackgroundImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- CART ---------------- */
  const handleAddToCart = async () => {
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      backgroundColor: "#fff",
    });

    const image = canvas.toDataURL("image/png");

    const cart = JSON.parse(localStorage.getItem("OrderData") || "[]");
    cart.push({
      image,
      quantity,
      price: price * quantity,
      labelType,
      labelSize,
      extraSheet,
      studentDetails,
    });

    localStorage.setItem("OrderData", JSON.stringify(cart));
    addToCart();
    navigate("/Order");
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      backgroundColor: "#fff",
    });

    const link = document.createElement("a");
    link.download = "custom-name-slip.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const sendToWhatsApp = () => {
    window.location.href = "https://api.whatsapp.com/send?phone=919498088659";
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full flex flex-col md:flex-row gap-8 p-6! bg-[#f9f7fd]">
      {/* LEFT – PREVIEW */}
      <div className="w-full md:w-[55%] flex justify-center">
        <div className="bg-white rounded-xl shadow-md p-4">
          <CustomNameSlipPreview
            previewRef={previewRef}
            backgroundImage={backgroundImage}
            selectedImage={selectedImage}
            imageBorder={imageBorder}
            circleImage={circleImage}
            brightness={brightness}
            contrast={contrast}
            transformations={imageTransforms}
            studentDetails={studentDetails}
            nameTrans={nameTrans}
            schooltrans={schoolTrans}
            subjecttrans={subjectTrans}
            rollnotrans={rollTrans}
            sectiontrans={sectionTrans}
            classtrans={classTrans}
            fontColor="#000"
            fontFamily="Arial"
          />
        </div>
      </div>

      {/* RIGHT – EDIT + CHECKOUT */}
      <div className="w-full md:w-[45%] flex flex-col gap-6">
        {/* IMAGE CONTROLS */}
        <ImagePersonalizationComp
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleImageUpload={handleImageUpload}
          imageBorder={imageBorder}
          setImageBorder={setImageBorder}
          circleImage={circleImage}
          setCircleImage={setCircleImage}
          setImageTransforms={setImageTransforms}
        />

        {/* BACKGROUND IMAGE */}
        <Box className="bg-white rounded-xl p-4 shadow-sm">
          <label className="text-sm font-medium mb-2 block">
            Background Image
          </label>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleBgUpload}
            size="small"
            fullWidth
          />
        </Box>

        {/* TEXT INPUTS */}
        {/* TEXT INPUTS */}
        <Box className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-4">
          {/* STUDENT NAME */}
          <EditableInput
            fieldKey="name"
            label="Student Name"
            value={studentDetails.name}
            onChange={(v) => handleInputChange("name", v)}
            labelTransforms={nameTrans}
            setLabelTransforms={setNameTrans}
            showPosition
          />

          {/* SCHOOL NAME */}
          <EditableInput
            fieldKey="schoolName"
            label="School Name"
            value={studentDetails.schoolName}
            onChange={(v) => handleInputChange("schoolName", v)}
            labelTransforms={schoolTrans}
            setLabelTransforms={setSchoolTrans}
            showPosition
          />

          {/* OTHER DETAILS ACCORDION */}

          <Accordion
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid #d1d5db", // gray-300
              borderRadius: "8px",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<FaExpandAlt />}
              className="rounded-lg! border! border-[#12345A]!"
              sx={{
                backgroundColor: "white",
                color: "#12345A",
                "&:hover": {
                  backgroundColor: "#12345A",
                  color: "white",
                },
                "&.Mui-expanded": {
                  backgroundColor: "#12345A",
                  color: "white",
                },
                "& .MuiAccordionSummary-expandIconWrapper svg": {
                  color: "#12345A !important",
                },
                "&:hover .MuiAccordionSummary-expandIconWrapper svg": {
                  color: "white !important",
                },
                "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper svg": {
                  color: "white !important",
                },
              }}
            >
              <div>Other Details</div>
            </AccordionSummary>

            <AccordionDetails>
              <div className="flex flex-col gap-5! mt-3!">
                <EditableInput
                  fieldKey="class"
                  label="Class"
                  value={studentDetails.class}
                  onChange={(v) => handleInputChange("class", v)}
                  labelTransforms={classTrans}
                  setLabelTransforms={setClassTrans}
                  showPosition
                />
                <EditableInput
                  fieldKey="section"
                  label="Section"
                  value={studentDetails.section}
                  onChange={(v) => handleInputChange("section", v)}
                  labelTransforms={sectionTrans}
                  setLabelTransforms={setSectionTrans}
                  showPosition
                />
                <EditableInput
                  fieldKey="rollNumber"
                  label="Roll Number"
                  value={studentDetails.rollNumber}
                  onChange={(v) => handleInputChange("rollNumber", v)}
                  labelTransforms={rollTrans}
                  setLabelTransforms={setRollTrans}
                  showPosition
                />
                <EditableInput
                  fieldKey="subject"
                  label="Subject"
                  value={studentDetails.subject}
                  onChange={(v) => handleInputChange("subject", v)}
                  labelTransforms={subjectTrans}
                  setLabelTransforms={setSubjectTrans}
                  showPosition
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* CHECKOUT (YOUR COMPONENT) */}
        <NameSlipCheckoutSection
          price={price * quantity}
          quantity={quantity}
          setQuantity={setQuantity}
          labelType={labelType}
          setLabelType={setLabelType}
          labelSize={labelSize}
          setLabelSize={setLabelSize}
          extraSheet={extraSheet}
          setExtraSheet={setExtraSheet}
          handleAddToCart={handleAddToCart}
          handleDownload={handleDownload}
          sendToWhatsApp={sendToWhatsApp}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default CustomNameSlips;
