"use client";

import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import TextEditPanel from "./TextEditPanel";
import { CiEdit } from "react-icons/ci";

const labelKeyForField = {
  name: "nameTrans",
  schoolName: "schoolTrans",
  class: "classTrans",
  section: "sectionTrans",
  rollNumber: "rollTrans",
  subject: "subjectTrans",
};

const EditableInput = ({
  fieldKey,
  label,
  value,
  onChange,
  labelTransforms,
  setLabelTransforms,
  maxLen = 24,
}) => {
  const [open, setOpen] = useState(false);
  const mappedKey = labelKeyForField[fieldKey];

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const handleChange = (val) => {
    onChange(val);

    if (!mappedKey) return;

    // 🔒 MOBILE FONT SIZE CLAMP
    if (isMobile) {
      const currentFontSize = labelTransforms?.[mappedKey]?.fontSize ?? 16;

      if (currentFontSize > 16) {
        setLabelTransforms((prev) => ({
          ...prev,
          [mappedKey]: {
            ...prev[mappedKey],
            fontSize: 16,
          },
        }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-3!">
      <div className="flex items-start gap-3">
        <TextField
          fullWidth
          size="small"
          label={label}
          value={value}
          inputProps={{ maxLength: maxLen }}
          helperText={`${value.length} of ${maxLen} characters used`}
          onChange={(e) => handleChange(e.target.value)}
        />

        <IconButton
          size="small"
          className="border! border-[#3E9D62]! text-[#3E9D62]! rounded-md! shadow-sm hover:shadow-md hover:bg-[#3E9D62]! hover:text-white! transition-all! duration-200! mt-1!"
          onClick={() => setOpen((prev) => !prev)}
        >
          <CiEdit />
        </IconButton>
      </div>

      <TextEditPanel
        open={open}
        fieldKey={mappedKey}
        labelTransforms={labelTransforms}
        setLabelTransforms={setLabelTransforms}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default EditableInput;
