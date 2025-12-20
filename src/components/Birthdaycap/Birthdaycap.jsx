import { Box, Button, TextField } from "@mui/material";
import BirthdayCapCanvas from "./BirthdayCapCanvas";
import { useNavigate } from "react-router-dom";
import ImagePersonalizationComp from "../../AppComponents/ImageEdit/ImagePersonalizationComp";
import EditableInput from "../../AppComponents/InputEdit/EditableInput";
import { useBirthdayCap } from "./useBirthdayCap";
import { PiShoppingCart } from "react-icons/pi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useRef } from "react";
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js";
import toast from "react-hot-toast";

const BirthdayCap = () => {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const {
    quantity,
    setQuantity,
    totalPrice,
    studentName,
    setStudentName,
    selectedImage,
    setSelectedImage,
    imageTransforms,
    setImageTransforms,
    nameTrans,
    setNameTrans,
  } = useBirthdayCap();

  const handleAddToCart = async () => {
    if (previewRef?.current) {
      try {
        const canvas = await html2canvas(previewRef.current);
        const imageData = canvas.toDataURL("image/png"); // Export as a Base64 image

        const cart = JSON.parse(localStorage.getItem("OrderData") || "[]");
        cart.push({
          image: imageData,
          quantity,
          price: totalPrice,
          name: "Birthday Cap",
        });

        localStorage.setItem("OrderData", JSON.stringify(cart));
        navigate("/Order");
      } catch (err) {
        console.warn(err);
        toast.error("Error in Adding to Cart");
      }
    }
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 items-start p-6! gap-5! bg-[#f9f7fd]">
      <BirthdayCapCanvas
        previewRef={previewRef}
        selectedImage={selectedImage}
        imageTransforms={imageTransforms}
        studentName={studentName}
        nameTrans={nameTrans}
      />
      <div className="flex flex-col gap-10! w-full">
        <div>
          <ImagePersonalizationComp
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setImageTransforms={setImageTransforms}
          />
          <EditableInput
            fieldKey="name"
            label="Student Name"
            value={studentName}
            onChange={setStudentName}
            labelTransforms={{ nameTrans }}
            setLabelTransforms={({ nameTrans }) => setNameTrans(nameTrans)}
          />
        </div>

        <div className="flex flex-col gap-3! items-start! w-full!">
          <Box className="flex items-center gap-3">
            <h3 className="text-[20px]! text-[#1A1A1A]! font-medium leading-5">
              Quantity:
            </h3>

            <Box className="flex items-center gap-3">
              {/* Decrease Button */}
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="min-w-10! w-10! h-10! rounded-xl! bg-red-600! hover:bg-red-700! flex justify-center items-center"
              >
                <AiOutlineMinus className="text-white text-xl" />
              </Button>

              {/* Quantity Input */}
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1) setQuantity(val);
                }}
                size="small"
                inputProps={{
                  min: 1,
                  style: {
                    borderRadius: "8px",
                    height: "40px",
                    border: "none",
                    textAlign: "center",
                    fontSize: "20px",
                    padding: "6px 0",
                  },
                }}
                className="w-20! border-none! rounded-lg!"
              />

              {/* Increase Button */}
              <Button
                onClick={() => setQuantity(quantity + 1)}
                className="min-w-10! w-10! h-10! rounded-xl! bg-green-600! hover:bg-green-700! flex justify-center items-center"
              >
                <AiOutlinePlus className="text-white text-xl" />
              </Button>
            </Box>
          </Box>

          <div className="font-semibold text-lg">Price: ₹{totalPrice}</div>

          <div className="flex flex-col items-start mt-4 w-full">
            <Button
              variant="contained"
              color="success"
              className="w-[300px] md:w-[400px] bg-[#3E9D62]! rounded-lg! h-12"
              onClick={handleAddToCart}
              startIcon={<PiShoppingCart />}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCap;
