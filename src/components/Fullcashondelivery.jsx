import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import toast from "react-hot-toast";

const FullCashOnDelivery = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => email.endsWith("@gmail.com");

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, pincode } = formData;

    if (!name || !email || !phone || !pincode) {
      toast.error("Please enter all details");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid Gmail address");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    const date = new Date();
    const fileName = `${name}-${date.getTime()}.txt`;
    console.log("Generated File:", fileName);

    toast.success(
      "Your information has been received successfully!\nOur team will contact you shortly.",
    );

    setFormData({
      name: "",
      email: "",
      phone: "",
      pincode: "",
    });
  };

  return (
    <div className="flex items-center justify-center px-4!">
      <div className="w-full max-w-[300px] md:max-w-[600px] bg-white rounded-xl shadow-lg p-6! flex flex-col gap-5!">
        <div className="flex flex-col gap-0!">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Contact Nearby Resellers
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Please fill in your details and our reseller will reach out to you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            inputProps={{ maxLength: 10 }}
            required
            fullWidth
          />

          <TextField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            inputProps={{ maxLength: 6 }}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            className="!bg-[#3E9D62] !py-2 !rounded-lg !text-white !font-semibold"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FullCashOnDelivery;
