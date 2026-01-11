import { Checkbox, FormControlLabel, TextField } from "@mui/material";
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

const EditUserTab = () => {
  const {
    selectedUserName,
    selectedUserPassword,
    setSelectedUserName,
    setSelectedUserPassword,
    formData,
    handleChange,
    handleProductChange,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useAdminPanel();

  return (
    <div className="p-6! flex flex-col gap-5!">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          type="text"
          label={"User Name"}
          value={selectedUserName}
          onChange={(e) => setSelectedUserName(e.target.value)}
        />
        <TextField
          type="password"
          label={"Password"}
          value={selectedUserPassword}
          onChange={(e) => setSelectedUserPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center! justify-center! w-full!">
        <button
          className="bg-[#12345A]! h-10! rounded-lg! w-[500px]! text-white! hover:cursor-pointer!"
          onClick={handleEditUser}
        >
          Fetch User Details
        </button>
      </div>

      {formData.id && (
        <div className="flex flex-col gap-4!">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4!">
            {["name", "id", "email", "password", "mobileno", "whatsappno"].map(
              (field) => (
                <TextField
                  label={field.toUpperCase()}
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              )
            )}
          </div>

          <div className="bg-gray-50 p-4! rounded">
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

          <div className="flex gap-3">
            <button
              className="bg-[#12345A]! h-10! rounded-lg! w-[500px]! text-white! hover:cursor-pointer!"
              onClick={handleUpdateUser}
            >
              Update User
            </button>

            <button
              className="bg-white! border! border-red-500! h-10! rounded-lg! w-[500px]! text-red-500! hover:cursor-pointer!"
              onClick={handleDeleteUser}
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserTab;
