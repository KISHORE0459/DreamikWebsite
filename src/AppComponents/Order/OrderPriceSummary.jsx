// OrderPriceSummary.jsx
import { Typography, Box, Switch } from "@mui/material";

export default function OrderPriceSummary({
  prodPrice,
  delPrice,
  cod,
  totalPrice,
  isVisible,
  visiblerp,
  selectedvalue,
  handleSelectOption,
  offer,
}) {
  return (
    <div className="p-4! flex flex-col items-start! gap-5!">
      <h3 className="font-semibold text-[20px]! leading-3! text-[#1A1A1A]!">
        Payment Summary
      </h3>
      <div className="flex flex-col items-start gap-4! pl-5!">
        <h3 className="text-[18px]! font-normal! leading-3 text-[#1A1A1A]!">
          Product Price: <span className="font-semibold!">₹ {prodPrice}</span>
        </h3>
        <h3 className="text-[18px]! font-normal! leading-3 text-[#1A1A1A]!">
          Delivery Charge: <span className="font-semibold!">₹ {delPrice}</span>
        </h3>
        <h3 className="text-[18px]! font-normal! leading-3 text-[#1A1A1A]!">
          COD Charge: <span className="font-semibold!">₹ {cod}</span>
        </h3>

        <h3 className="text-[18px]! font-normal! leading-3 text-[#1A1A1A]!">
          Total: <span className="font-semibold!">₹ {totalPrice}</span>
        </h3>

        {offer && (
          <p className="text-green-600 text-sm font-medium">
            Free shipping available for Chennai pincodes!
          </p>
        )}

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
    </div>
  );
}
