// OrderDetailsSection.jsx
import {
  Box,
  Card,
  Typography,
  RadioGroup,
  TextField,
  Button,
  Switch,
} from "@mui/material";
import CardRadioOption from "../AppForm/CardRadio";
import OrderPriceSummary from "./OrderPriceSummary";

export default function OrderDetailsSection({
  deliveryMode,
  handleDeliveryChange,
  paymentMode,
  handlePaymentChange,
  couponCode,
  handleCouponChange,
  handleSubmitCoupon,
  isReseller,
  isVisible,
  visiblerp,
  selectedvalue,
  handleSelectOption,

  fc, // form defaults
  fetchLocation,
  handleProceedToPayment,
  prodPrice,
  delPrice,
  cod,
  totalPrice,
}) {
  return (
    <Box className="space-y-6">
      <div className="p-4! flex flex-col items-start! gap-5!">
        <h3 className="font-semibold text-[20px]! leading-3! text-[#1A1A1A]!">
          Delivery Mode
        </h3>
        <RadioGroup
          value={deliveryMode}
          onChange={handleDeliveryChange}
          className="flex flex-row! gap-2.5! items-center flex-wrap!"
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
      <div className="p-4! flex flex-col items-start! gap-5!">
        <h3 className="font-semibold text-[20px]! leading-3! text-[#1A1A1A]!">
          Payment Mode
        </h3>
        <RadioGroup
          value={paymentMode}
          onChange={(e) => handlePaymentChange(e.target.value)}
          className="flex flex-row! gap-2.5! items-center flex-wrap!"
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

      {/* COUPONS */}
      <div className="p-4! flex flex-col items-start! gap-5!">
        <h3 className="font-semibold text-[20px]! leading-3! text-[#1A1A1A]!">
          Coupons
        </h3>
        <div className="flex items-center! gap-3">
          <TextField
            fullWidth
            label="Coupon"
            value={couponCode}
            onChange={handleCouponChange}
            className="w-[200px]! md:w-[400px]! text-left!"
          />
          <Button
            variant="contained"
            onClick={handleSubmitCoupon}
            className="h-10 bg-[#3E9D62]! rounded-lg!"
          >
            Apply
          </Button>
        </div>

        {/* Reseller or Instant toggle */}
        {visiblerp && (
          <Box className="mt-3 flex items-center gap-2">
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
          </Box>
        )}
      </div>

      <OrderPriceSummary
        prodPrice={prodPrice}
        delPrice={delPrice}
        cod={cod}
        totalPrice={totalPrice}
        isVisible={isVisible}
        visiblerp={visiblerp}
        selectedvalue={selectedvalue}
        handleSelectOption={handleSelectOption}
      />

      {/* ADDRESS FORM */}
      <div className="p-4! flex flex-col items-start! gap-5!">
        <h3 className="font-semibold text-[20px]! leading-3! text-[#1A1A1A]!">
          Delivery Details
        </h3>

        <form
          className="w-full! flex flex-col gap-4!"
          onSubmit={(e) => {
            e.preventDefault();
            handleProceedToPayment();
          }}
        >
          <div className="flex flex-col gap-3">
            <TextField
              fullWidth
              label="Name"
              name="name"
              defaultValue={fc.name || ""}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              defaultValue={fc.email || ""}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              defaultValue={fc.phone || ""}
              required
            />
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              defaultValue={fc.pincode || ""}
              onChange={(e) => fetchLocation(e.target.value)}
            />
            <TextField
              fullWidth
              label="District"
              name="district"
              defaultValue={fc.district || ""}
            />
            <TextField
              fullWidth
              label="State"
              name="state"
              defaultValue={fc.state || ""}
            />
            <TextField
              fullWidth
              label="Address Line 1"
              name="address1"
              defaultValue={fc.address1 || ""}
            />
            <TextField
              fullWidth
              label="Address Line 2"
              name="address2"
              defaultValue={fc.address2 || ""}
            />
          </div>

          <Button
            type="submit"
            className="w-full! h-10! bg-[#3E9D62]! rounded-lg! text-white!"
          >
            Proceed To Payment
          </Button>
        </form>
      </div>
    </Box>
  );
}
