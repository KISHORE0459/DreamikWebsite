"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import EditableInput from "../InputEdit/EditableInput";
import ImagePersonalizationComp from "../ImageEdit/ImagePersonalizationComp";
import { FaExpandAlt } from "react-icons/fa";

export default function NameSlipPersonalizationSection({
  studentDetails = {},
  setStudentDetails = () => {},
  labelTransforms = {},
  setLabelTransforms = () => {},
  setImageTransforms = () => {},
  imageBorder = false,
  setImageBorder = () => {},
  circleImage = false,
  setCircleImage = () => {},
  handleImageUpload = () => {},
  selectedImage = null,
  setSelectedImage = () => {},
  handleDeleteImage = () => {},
}) {
  // react-hook-form to control the checkboxes
  const { control, watch } = useForm({
    defaultValues: {
      imageBorder: imageBorder,
      circleImage: circleImage,
    },
  });

  // local helper to update studentDetails
  const updateField = (name, val) =>
    setStudentDetails((s) => ({ ...s, [name]: val }));

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.imageBorder !== imageBorder) {
        setImageBorder(value.imageBorder);
      }
      if (value.circleImage !== circleImage) {
        setCircleImage(value.circleImage);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, imageBorder, circleImage, setImageBorder, setCircleImage]);

  return (
    <Box className="w-full flex flex-col gap-5!">
      {/* top area: upload + image controls */}
      <ImagePersonalizationComp
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleImageUpload={handleImageUpload}
        handleDeleteImage={handleDeleteImage}
        imageBorder={imageBorder}
        setImageBorder={setImageBorder}
        circleImage={circleImage}
        setCircleImage={setCircleImage}
        setImageTransforms={setImageTransforms}
        enableImageCropping={true}
      />

      {/* Inputs with individual edit icons and collapsible control panels */}
      <div className="flex flex-col gap-5!">
        <EditableInput
          fieldKey="name"
          label="Enter student name"
          value={studentDetails.name}
          onChange={(v) => updateField("name", v)}
          labelTransforms={labelTransforms}
          setLabelTransforms={setLabelTransforms}
        />

        <EditableInput
          fieldKey="schoolName"
          label="Enter school name"
          value={studentDetails.schoolName}
          onChange={(v) => updateField("schoolName", v)}
          labelTransforms={labelTransforms}
          setLabelTransforms={setLabelTransforms}
        />

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
                onChange={(v) => updateField("class", v)}
                labelTransforms={labelTransforms}
                setLabelTransforms={setLabelTransforms}
              />

              <EditableInput
                fieldKey="section"
                label="Section"
                value={studentDetails.section}
                onChange={(v) => updateField("section", v)}
                labelTransforms={labelTransforms}
                setLabelTransforms={setLabelTransforms}
              />

              <EditableInput
                fieldKey="rollNumber"
                label="Roll Number"
                value={studentDetails.rollNumber}
                onChange={(v) => updateField("rollNumber", v)}
                labelTransforms={labelTransforms}
                setLabelTransforms={setLabelTransforms}
              />

              <EditableInput
                fieldKey="subject"
                label="Subjects (comma separated)"
                value={studentDetails?.subject}
                onChange={(v) => updateField("subject", v)}
                labelTransforms={labelTransforms}
                setLabelTransforms={setLabelTransforms}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </Box>
  );
}
