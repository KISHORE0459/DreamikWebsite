import { Button, Select, MenuItem, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleform from "../order/Googleform";
import { usePayment } from "../../AppHooks/usePayment";
import toast from "react-hot-toast";

const Payment = () => {
  const navigate = useNavigate();
  const {
    orderData,
    priceDetails,
    deliveryMode,
    paymentMode,
    testPayCode,
    setTestPayCode,
    handlePayment,
    isLoading,
    orderId,
    isError,
  } = usePayment(navigate);

  console.log("product detail", orderData, priceDetails);

  const [gateway, setGateway] = useState("razorpay");
  const [couponOpen, setCouponOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white! p-4! md:p-6!">
      <Googleform iserror={isError} invoiceid={orderId} />

      <div className="w-full">
        <div className="flex flex-col gap-5!">
          <h2 className="text-[32px]! text-[#12345A]! font-bold! text-center!">
            Dreamik AI Payment Gateway
          </h2>

          {isLoading ? (
            <div className="text-center space-y-2 py-10">
              <p className="text-lg">Please wait, confirming your order…</p>
              <p className="text-sm text-gray-600">
                Invoice ID: <strong>{orderId}</strong>
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-10! items-start! p-4!">
                  <div className="w-full! flex flex-col gap-2! items-start!">
                    <h4 className="text-[18px] font-semibold! text-[#1A1A1A]">
                      Payment Method
                    </h4>

                    <Select
                      fullWidth
                      value={gateway}
                      onChange={(e) => setGateway(e.target.value)}
                      className="text-left!"
                    >
                      <MenuItem value="razorpay">Razorpay</MenuItem>
                    </Select>
                  </div>

                  <div className="w-full! flex flex-col gap-2!">
                    <div className="w-full! flex justify-end!">
                      <h3
                        variant="text"
                        onClick={() => setCouponOpen(true)}
                        className="self-start text-blue-500 hover:cursor-pointer! hover:text-blue-700!"
                      >
                        Have a coupon?
                      </h3>
                    </div>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePayment}
                      className="w-full bg-[#3E9D62]! h-13!"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4! flex flex-col gap-3! items-start!">
                  <h4 className="text-[18px] font-semibold! text-[#1A1A1A]">
                    Payment Method
                  </h4>

                  <ul className="text-sm space-y-1">
                    {orderData.map((item, idx) => (
                      <li key={idx} className="text-[16px]!">
                        {item.Name} × {item.quantity} — ₹{item.price}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t pt-3 text-[16px]! flex flex-col gap-1! items-start!">
                    <p>Products: ₹{priceDetails.prodPrice || 0}</p>
                    <p>Delivery: ₹{priceDetails.delPrice || 0}</p>
                    <p>COD: ₹{priceDetails.cod || 0}</p>
                    <p className="font-semibold">
                      Total: ₹{priceDetails.totalPrice || 0}
                    </p>
                  </div>

                  <div className="text-[16px] text-gray-600 flex flex-col gap-1! items-start!">
                    <p>
                      Delivery Mode:{" "}
                      <span className="text-[#1A1A1A] font-semibold">
                        {deliveryMode}
                      </span>
                    </p>
                    <p>
                      Payment Mode:{" "}
                      <span className="text-[#1A1A1A] font-semibold">
                        {paymentMode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* COUPON MODAL */}
      <CouponModal
        open={couponOpen}
        onClose={() => setCouponOpen(false)}
        value={testPayCode}
        onChange={(e) => setTestPayCode(e.target.value)}
      />
    </div>
  );
};

export default Payment;

const CouponModal = ({ open, onClose, value, onChange }) => {
  const handleApply = () => {
    // Empty coupon = remove coupon
    if (!value || value.trim() === "") {
      toast.error("Coupon removed");
      onClose();
      return;
    }

    // Basic format validation (same rules used in payment logic)
    const isTest = value == "TESTFORDEV";
    const isTestPay = value.startsWith("$TESTPAY$") && value.length === 19;
    const isDiscount = value.startsWith("$DISCOUNT$") && value.length === 20;

    if (!isTestPay && !isDiscount && !isTest) {
      onChange?.("");
      toast.error("Invalid coupon code");
      return;
    }

    toast.success("Coupon applied successfully");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6! w-[90%] sm:w-[400px] flex flex-col gap-5!">
        <h3 className="text-[#12345A]! text-[18px] font-semibold">
          Apply Coupon
        </h3>

        <TextField
          fullWidth
          label="Enter coupon code"
          value={value}
          onChange={onChange}
          placeholder="$DISCOUNT$XXXXXXX"
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border! border-red-500! text-red-500! bg-white!"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleApply}
            className="bg-[#3E9D62]!"
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
};
