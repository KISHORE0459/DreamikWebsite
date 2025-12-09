import { useState } from "react";
import { Collapse, Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MdCurrencyRupee } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";

const ProductDescription = ({
  product,
  secondsLeft,
  onAddToCart,
  showHighlights = true,
  showMatteAndGlossy = false,
}) => {
  const [openHighlights, setOpenHighlights] = useState(showHighlights);

  return (
    <div className="flex flex-col items-start! gap-5!">
      <div className="flex flex-col gap-5! items-start w-full">
        {/* TITLE + PRICE */}
        <div className="flex flex-col gap-4 items-start">
          <h3 className="text-[24px]! text-[#1A1A1A]! font-medium! leading-7! text-left">
            {product?.name}
          </h3>

          <div className="flex flex-col items-start gap-6 mb-4 w-full">
            <div className="flex flex-row items-center gap-px">
              <h3 className="text-[20px]! text-[#1A1A1A]! font-medium leading-5">
                Price:
              </h3>

              <MdCurrencyRupee className="w-[17px] h-[17px]" fill="#3E9D62" />

              <p className="text-[20px]! font-medium text-[#3E9D62]! leading-5">
                {product?.price}
              </p>
            </div>

            {secondsLeft !== null &&
              typeof secondsLeft === "number" &&
              secondsLeft > 0 && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className="text-left"
                >
                  Offer ends in: {Math.floor(secondsLeft / 3600)}h{" "}
                  {Math.floor((secondsLeft % 3600) / 60)}m
                </Typography>
              )}
          </div>
        </div>

        {/* HIGHLIGHTS (DROPDOWN) */}
        <div className="mb-4 w-full">
          <div
            onClick={() => setOpenHighlights(!openHighlights)}
            className="flex items-center cursor-pointer select-none gap-2!"
          >
            <ExpandMoreIcon
              className={`transition-transform duration-300 ${
                openHighlights ? "rotate-0" : "rotate-270"
              }`}
            />

            <h3 className="text-left font-semibold! text-[18px]! text-[#1A1A1A]! leading-5">
              ✨ Our Product Highlights ✨
            </h3>
          </div>

          <Collapse in={openHighlights}>
            <ul className="list-disc list-inside text-[16px]! text-[#1A1A1A]! font-medium! flex flex-col gap-2! items-start mt-2! ml-3!">
              <li>
                <span className="text-[#12345A]! font-semibold!">Quick:</span>{" "}
                Get your product delivered the same day!
              </li>

              <li>
                <span className="text-[#12345A]! font-semibold!">
                  Affordable:
                </span>{" "}
                The most economical choice in the market!
              </li>

              <li>
                <span className="text-[#12345A]! font-semibold!">Safe:</span>{" "}
                Printed with child-friendly Inkjet colors.
              </li>
            </ul>
          </Collapse>
        </div>

        {/* CTA BUTTON */}
        <div className="flex flex-col items-start mt-4 w-full">
          <Button
            variant="contained"
            size="large"
            startIcon={<PiShoppingCart />}
            onClick={onAddToCart}
            sx={{
              maxWidth: { base: "300px", md: "400px" },
              width: "100%",
              backgroundColor: "#12345A",
              "&:hover": { backgroundColor: "#12345A" },
              py: 1.8,
              boxShadow: "0 6px 20px rgba(30,136,229,0.2)",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            PERSONALIZE AND ADD TO CART
          </Button>
        </div>

        {/* MATTE + GLOSSY (conditional) */}
        {showMatteAndGlossy && (
          <div className="flex flex-col items-start! gap-1!">
            <h3 className="text-[16px]! text-[#1A1A1A]! font-normal! leading-5 text-left">
              <span className="font-medium!">Matte:</span> Get 36 nos of 10x4.5
              cm size on 80 GSM paper matte sticker paper
            </h3>

            <h3 className="text-[16px]! text-[#1A1A1A]! font-normal! leading-5 text-left">
              <span className="font-medium!">Glossy:</span> Get 36 nos of 10x4.5
              cm size on 120 GSM paper glossy sticker paper
            </h3>
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="flex flex-col gap-2! items-start!">
        <h2 className="text-[20px] text-[#1A1A1A]! font-semibold leading-1">
          Product Info
        </h2>

        <div className="flex flex-col items-start gap-1! ml-2!">
          <h3 className="text-[#1A1A1A]! text-[16px]! font-medium leading-5">
            {product?.name}
          </h3>

          <h3 className="text-[#1A1A1A]! text-[16px]! font-medium leading-5">
            {product?.props?.join(", ")}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
