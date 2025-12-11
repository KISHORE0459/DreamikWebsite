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
}) => {
  const [open, setOpen] = useState(false);

  const mappedKey = labelKeyForField[fieldKey];

  return (
    <div className="flex flex-col gap-3!">
      <div className="flex items-center gap-3">
        <TextField
          fullWidth
          size="small"
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <IconButton
          size="small"
          className="border! border-[#3E9D62]! text-[#3E9D62]! rounded-md! shadow-sm hover:shadow-md hover:bg-[#3E9D62]! hover:text-white! transition-all! duration-200!"
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
      />
    </div>
  );
};

export default EditableInput;
