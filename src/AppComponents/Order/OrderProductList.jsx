// OrderProductList.jsx
import { Typography, Button, Box } from "@mui/material";
import { IoTrashBin } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";

export default function OrderProductList({
  orderData,
  removeProduct,
  handleEditOrder,
  handleAddProduct,
  navigate,
}) {
  return (
    <div className="w-full flex flex-col gap-10!">
      <div className="flex flex-col gap-5!">
        {orderData?.map((prod, index) => (
          <div
            key={index}
            className="flex items-start justify-stretch! gap-4 shadow-md p-3! h-[250px] border! border-[#7D8597]! rounded-lg!"
          >
            <img
              src={prod?.image}
              alt={prod?.name}
              className="w-[300px]! h-[200px]! object-contain rounded-md"
            />
            <div className="w-full! min-h-full! flex flex-col! justify-between! gap-2">
              <div className="flex flex-col gap-2 text-left">
                <h3 className="text-[16px]! font-normal! text-[#1A1A1A]! leading-5!">
                  Name :
                  <span className="font-semibold!">
                    {prod.Name ?? prod?.name}
                  </span>
                </h3>
                {prod?.labeltype && (
                  <h3 className="text-[16px]! font-normal! text-[#1A1A1A]! leading-5!">
                    Type:{" "}
                    <span className="font-semibold!">{prod?.labeltype}</span>
                  </h3>
                )}
                <h3 className="text-[16px]! font-normal! text-[#1A1A1A]! leading-5!">
                  Price:
                  <span className="font-semibold!">
                    ₹ {parseInt(prod.price, 10)}
                  </span>
                </h3>
                <h3 className="text-[16px]! font-normal! text-[#1A1A1A]! leading-5!">
                  Quantity:
                  <span className="font-semibold!">{prod.quantity}</span>
                </h3>
              </div>
              <div>
                <button
                  onClick={() => removeProduct(prod)}
                  className="w-10 h-10 p-0! flex justify-center items-center border! border-red-500! bg-white! hover:bg-red-500!  text-red-500! hover:text-white! hover:cursor-pointer!"
                >
                  <IoTrashBin size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full! flex justify-center items-center">
        <Button
          onClick={handleAddProduct}
          startIcon={<MdOpenInNew />}
          className="w-[300px]! h-10 rounded-lg! bg-[#12345A]! text-white!"
        >
          Add Product
        </Button>
      </div>
    </div>
  );
}
