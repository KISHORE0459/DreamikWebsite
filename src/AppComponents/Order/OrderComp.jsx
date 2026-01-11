import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import Swal from "sweetalert2";

// CHILD COMPONENTS
import OrderProductList from "./OrderProductList";
import OrderPriceSummary from "./OrderPriceSummary";
import OrderDetailsSection from "./OrderDetailSection";
import Googleform from "../../components/order/Googleform";
import { CartContext } from "../../components/CartContext";
import { useOrderActions } from "./useOrderActions";
import toast from "react-hot-toast";

const OrderComp = ({ handleEditOrder, orderData, setOrderData, coupon }) => {
  const navigate = useNavigate();
  const { cartCount, removeFromCart, oneplus1diff } = useContext(CartContext);

  /* -------------------- STATES -------------------- */
  const [selectedvalue, setselectedvalue] = useState("normal");
  const [whatsapp, setwhatsapp] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState("normal-delivery");
  const [paymentMode, setPaymentMode] = useState("online-payment");
  const [isReseller, setIsReseller] = useState(false);
  const [prodPrice, setProdPrice] = useState(0);
  const [delPrice, setDelPrice] = useState(50);
  const [cod, setCod] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponUsed, setCouponUsed] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [initalprodprice, setInitialPrice] = useState(0);
  const [isVisible, setvisible] = useState(false);
  const [visiblerp, setvisiblerp] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderid, setorderid] = useState("");
  const [orderid2, setOrderId2] = useState("");
  const [iserror, seterror] = useState(false);
  const [discount1, setdiscount1] = useState(0);
  const [rescoup, setRescoup] = useState();
  const [influencer, setInfluencer] = useState(false);
  const [offercount, setOffercount] = useState(
    localStorage.getItem("offercount") || null
  );
  const [resellerformdata, setResellerformdata] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [pincode, setpincode] = useState(null);

  const hasShownRef = useRef(false);
  const fc = JSON.parse(localStorage.getItem("FormContainer")) || [];

  /* -------------------- FREE GIFT TOAST -------------------- */
  useEffect(() => {
    if (cartCount % 2 === 1 && !hasShownRef.current && oneplus1diff > 5) {
      toast.success("Almost there—add 1 more for your FREE gift!", {
        autoClose: 5000,
      });
      hasShownRef.current = true;
    } else if (cartCount % 2 === 0) {
      hasShownRef.current = false;
    }
  }, [cartCount, oneplus1diff]);

  /* -------------------- GLOBAL ERROR SAFETY -------------------- */
  useEffect(() => {
    window.onerror = function (_, __, ___, ____, error) {
      if (error?.message?.toLowerCase().includes("startswith")) {
        localStorage.removeItem("OrderData");
        localStorage.removeItem("editedproduct");
        window.location.reload();
      }
    };
  }, []);

  /* -------------------- TOTAL PRICE -------------------- */
  useEffect(() => {
    setTotalPrice(prodPrice + delPrice + cod);
  }, [prodPrice, delPrice, cod]);

  /* -------------------- INIT LOAD -------------------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("OrderData")) || [];
    setOrderData(stored);
    getPrice(stored);
    createZipFile(stored);

    setIsReseller(localStorage.getItem("ResellerLogin"));
    setRescoup(localStorage.getItem("Rescoup"));
  }, []);

  /* -------------------- PRICE CALC -------------------- */
  const getPrice = (data) => {
    const total = data.reduce((sum, p) => sum + Number(p.price || 0), 0);
    setProdPrice(total);
    setInitialPrice(total);
  };

  /* -------------------- ZIP CREATION -------------------- */
  const createZipFile = async (items) => {
    const zip = new JSZip();
    for (const [i, item] of items.entries()) {
      if (item?.image) {
        const base64 = item.image.replace(/^data:image\/\w+;base64,/, "");
        zip.file(`order_image_${i + 1}.png`, base64, { base64: true });
      }
    }
    const blob = await zip.generateAsync({ type: "blob" });
    setZipFile(blob);
  };

  /* -------------------- ACTION HOOK -------------------- */
  const {
    handleDeliveryChange,
    handlePaymentChange,
    handleCouponChange,
    handleSubmitCoupon,
    handleSelectOption,
    fetchLocation,
    removeProduct,
    handleProceedToPayment,
  } = useOrderActions({
    selectedvalue,
    deliveryMode,
    paymentMode,
    couponCode,
    couponUsed,
    initalprodprice,
    prodPrice,
    orderData,
    setselectedvalue,
    setDeliveryMode,
    setPaymentMode,
    delPrice,
    setDelPrice,
    cod,
    setCod,
    setCouponCode,
    setCouponUsed,
    setvisible,
    setvisiblerp,
    discount1,
    setdiscount1,
    setProdPrice,
    setOrderData,
    influencer,
    setInfluencer,
    setpincode,
    removeFromCart,
    navigate,
    totalPrice,
    isReseller,
  });

  /* -------------------- JSX -------------------- */
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[30px]! px-4! py-6!">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 text-white">
          <p className="text-lg font-semibold">Saving Order, Please wait...</p>
          <p className="mt-2">
            Invoice ID: <strong>{orderid}</strong>
          </p>
        </div>
      )}

      {/* LEFT — PRODUCT LIST */}
      <div className="w-full space-y-4">
        <OrderProductList
          orderData={orderData}
          removeProduct={removeProduct}
          handleEditOrder={handleEditOrder}
          handleAddProduct={() => (window.location.href = "/")}
          navigate={navigate}
        />
      </div>

      {/* RIGHT — DETAILS + PRICE */}
      <div className="w-full space-y-6">
        <OrderDetailsSection
          deliveryMode={deliveryMode}
          paymentMode={paymentMode}
          couponCode={couponCode}
          isReseller={isReseller}
          isVisible={isVisible}
          visiblerp={visiblerp}
          selectedvalue={selectedvalue}
          fc={fc}
          handleDeliveryChange={handleDeliveryChange}
          handlePaymentChange={handlePaymentChange}
          handleCouponChange={handleCouponChange}
          handleSubmitCoupon={handleSubmitCoupon}
          handleSelectOption={handleSelectOption}
          fetchLocation={fetchLocation}
          handleProceedToPayment={handleProceedToPayment}
          prodPrice={prodPrice}
          delPrice={delPrice}
          cod={cod}
          totalPrice={totalPrice}
        />
      </div>

      {iserror && (
        <Googleform iserror={iserror} seterror={seterror} invoiceid={orderid} />
      )}
    </div>
  );
};

export default OrderComp;
