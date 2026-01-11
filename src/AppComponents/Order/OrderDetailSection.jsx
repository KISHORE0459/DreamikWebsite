import {
  Box,
  Typography,
  RadioGroup,
  TextField,
  Button,
  Switch,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CardRadioOption from "../AppForm/CardRadio";
import OrderPriceSummary from "./OrderPriceSummary";

export default function OrderDetailsSection({
  // delivery
  deliveryMode,
  handleDeliveryChange,

  // payment
  paymentMode,
  handlePaymentChange,

  // coupons
  couponCode,
  handleCouponChange,
  handleSubmitCoupon,

  // instant toggle
  visiblerp,
  selectedvalue,
  handleSelectOption,

  // form
  fc,
  fetchLocation,
  handleProceedToPayment,

  // price
  prodPrice,
  delPrice,
  cod,
  totalPrice,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: fc.name || "",
      email: fc.email || "",
      phone: fc.phone || "",
      whatsappno: fc.whatsappno || "",
      pincode: fc.pincode || "",
      district: fc.district || "",
      state: fc.state || "",
      address1: fc.address1 || "",
      address2: fc.address2 || "",
      landmark: fc.landmark || "",
    },
  });

  return (
    <Box className="space-y-6">
      {/* ================= DELIVERY MODE ================= */}
      <div className="p-4! flex flex-col items-start! gap-3!">
        <Typography fontWeight={600}>Delivery Mode</Typography>

        <RadioGroup
          value={deliveryMode}
          onChange={handleDeliveryChange}
          row
          className="gap-2!"
        >
          <CardRadioOption
            value="normal-delivery"
            label="Normal Delivery"
            selected={deliveryMode}
          />
          <CardRadioOption
            value="express-delivery"
            label="Express Delivery"
            selected={deliveryMode}
          />
          <CardRadioOption
            value="Self-pick up"
            label="Self Pickup"
            selected={deliveryMode}
          />
        </RadioGroup>
      </div>

      {/* ================= PAYMENT MODE ================= */}
      <div className="p-4! flex flex-col items-start! gap-3!">
        <Typography fontWeight={600}>Payment Mode</Typography>

        <RadioGroup
          value={paymentMode}
          onChange={(e) => handlePaymentChange(e.target.value)}
          row
          className="gap-2"
        >
          <CardRadioOption
            value="online-payment"
            label="Online Payment"
            selected={paymentMode}
          />
          <CardRadioOption
            value="partial-payment"
            label="Partial Cash On Delivery"
            selected={paymentMode}
          />
          <CardRadioOption
            value="cashon-payment"
            label="Full Cash On Delivery"
            selected={paymentMode}
          />
        </RadioGroup>
      </div>

      {/* ================= COUPONS ================= */}
      <div className="w-full! p-4! flex flex-col items-start! gap-3!">
        <Typography fontWeight={600}>Coupons</Typography>

        <div className="w-full! flex items-center! gap-2">
          <TextField
            label="Coupon Code"
            value={couponCode}
            onChange={handleCouponChange}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSubmitCoupon}
            className="bg-[#3e9d62] h-10!"
          >
            Apply
          </Button>
        </div>

        {/* Normal / Instant Toggle */}
        {visiblerp && (
          <div className="flex items-center! gap-2! mt-2!">
            <Typography>Normal</Typography>
            <Switch
              checked={selectedvalue === "instant"}
              onChange={() =>
                handleSelectOption({
                  target: {
                    value: selectedvalue === "normal" ? "instant" : "normal",
                  },
                })
              }
            />
            <Typography>Instant</Typography>
          </div>
        )}
      </div>

      {/* ================= PRICE SUMMARY ================= */}
      <OrderPriceSummary
        prodPrice={prodPrice}
        delPrice={delPrice}
        cod={cod}
        totalPrice={totalPrice}
      />

      {/* ================= ADDRESS FORM ================= */}
      <div className="w-full! p-4! flex flex-col gap-4! items-start!">
        <Typography fontWeight={600}>Delivery Details</Typography>

        <form
          onSubmit={handleSubmit(handleProceedToPayment)}
          className="w-full! flex flex-col gap-3!"
        >
          <TextField
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField label="Email" {...register("email")} />

          <TextField
            label="Phone"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^\d{10,13}$/,
                message: "Enter valid phone number",
              },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <TextField
            label="Pincode"
            {...register("pincode", {
              required: "Pincode required",
              pattern: {
                value: /^\d{6}$/,
                message: "Invalid pincode",
              },
              onChange: async (e) => {
                const code = e.target.value.slice(0, 6);
                e.target.value = code;
                if (code?.length >= 6) {
                  const data = await fetchLocation(code);
                  if (data?.District || data?.State) {
                    setValue("district", data?.District);
                    setValue("state", data?.State);
                  }
                }
              },
            })}
            type="number"
            error={!!errors.pincode}
            helperText={errors.pincode?.message}
          />

          <TextField
            label="District"
            {...register("district")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="State"
            {...register("state")}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Address Line 1"
            {...register("address1", { required: "Address required" })}
            error={!!errors.address1}
            helperText={errors.address1?.message}
          />

          <TextField label="Address Line 2" {...register("address2")} />

          <Button
            type="submit"
            variant="contained"
            className="mt-3! bg-[#3e9d62]! h-10!"
          >
            Proceed To Payment
          </Button>
        </form>
      </div>
    </Box>
  );
}
