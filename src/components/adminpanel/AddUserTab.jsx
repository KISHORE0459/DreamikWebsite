import {
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useAdminPanel } from "../../AppHooks/useAdminPanel";

const PRODUCTS = [
  "Name Slips",
  "Cutout Nameslip",
  "Bulk Order",
  "Custom Name Slips",
  "Customizable Posters",
  "Customizable Bag Tags",
  "Customizable Stickers",
  "Customizable Fridge Magnets",
  "Notebooks",
  "AI Prompt Generating Nameslips",
  "Customizable Pencil Engraving",
  "Dreamik Glossy Inkjet/Laser printer",
];

const AddUserTab = () => {
  const { formData, handleChange, handleProductChange, handleAddUser } =
    useAdminPanel();

  return (
    <div className="p-4! flex flex-col gap-5!">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["name", "id", "email", "password", "mobileno", "whatsappno"].map(
          (field) => (
            <TextField
              type="text"
              key={field}
              name={field}
              label={field.toUpperCase()}
              value={formData[field]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          )
        )}
      </div>

      <div className="p-4! flex flex-col items-start!">
        <p className="font-semibold mb-2">Applicable Products</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRODUCTS.map((p) => (
            <FormControlLabel
              key={p}
              control={
                <Checkbox
                  checked={formData.products.includes(p)}
                  onChange={() => handleProductChange(p)}
                />
              }
              label={p}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start! gap-3!">
        {["walkin", "chekin", "courier"].map((k) => (
          <>
            <InputLabel>{k}</InputLabel>
            <Select
              key={k}
              name={k}
              value={formData[k]}
              onChange={handleChange}
              className="border p-2 rounded text-left! w-[300px]"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </>
        ))}
      </div>

      <button
        className="bg-[#12345A]! h-10! rounded-lg! w-[500px]! text-white! hover:cursor-pointer!"
        onClick={handleAddUser}
      >
        Add User
      </button>
    </div>
  );
};

export default AddUserTab;
