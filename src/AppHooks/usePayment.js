import { useEffect, useState } from "react";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import { apiEndPoint } from "../appConfig";
import toast from "react-hot-toast";

export const usePayment = (navigate) => {
  const [orderData, setOrderData] = useState([]);
  const [priceDetails, setPriceDetails] = useState({});
  const [deliveryMode, setDeliveryMode] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [testPayCode, setTestPayCode] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [formContainer, setFormContainer] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [isError, setIsError] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderId2, setOrderId2] = useState("");
  const [couponCode, setCouponCode] = useState("");

  /* ---------------- UTILS ---------------- */
  const generateRandomString = (length = 5) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  };

  const generateOrderID = () => {
    if (!formContainer?.name) return "";
    const prefix = formContainer.coupon ? "R" : "C";
    const base = `${prefix}${formContainer.name}`;
    const now = new Date().toISOString().replace(/[-:.TZ]/g, "");
    return `${base}${now}-${generateRandomString()}-v1`;
  };

  /* ---------------- SDK ---------------- */
  const loadRazorpaySDK = () => {
    if (sdkLoaded) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setSdkLoaded(true);
    script.onerror = () =>
      toast.error("Error loading payment gateway. Please try again.");
    document.body.appendChild(script);
  };

  /* ---------------- ZIP ---------------- */
  const createZipFile = async (orders) => {
    const zip = new JSZip();
    orders.forEach((item, i) => {
      if (item?.image) {
        const base64 = item.image.replace(/^data:image\/\w+;base64,/, "");
        const binary = atob(base64);
        zip.file(
          `order_image_${i + 1}.png`,
          Uint8Array.from(binary, (c) => c.charCodeAt(0)),
        );
      }
    });
    setZipFile(await zip.generateAsync({ type: "blob" }));
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    loadRazorpaySDK();

    const storedOrders = JSON.parse(localStorage.getItem("OrderData")) || [];
    const storedPrice = JSON.parse(localStorage.getItem("PriceData")) || {};
    const storedPayment =
      JSON.parse(localStorage.getItem("PaymentDetails")) || {};
    const storedForm = JSON.parse(localStorage.getItem("FormContainer")) || {};

    setOrderData(storedOrders);
    setPriceDetails(storedPrice);
    setPaymentMode(storedPayment.paymentMode || "");
    setDeliveryMode(storedPayment.deliveryMode || "");
    setFormContainer(storedForm);
    setCouponCode(storedForm.coupon);
    createZipFile(storedOrders);
  }, []);

  /* ---------------- SAVE ORDER ---------------- */
  const saveOrderDetails = async (paymentData, finalAmount) => {
    const id = generateOrderID();
    setOrderId(id);

    let secondaryId = "";
    try {
      const res = await fetch(
        "https://0xij5t5kzk.execute-api.ap-south-1.amazonaws.com/prod/generate-id",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceid: id,
            requesterid: localStorage.getItem("resid")?.slice(0, 2) || "cs",
            requestmobil: formContainer.phone,
            option: "none",
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        secondaryId = data.orderid;
        setOrderId2(secondaryId);
      }
    } catch (err) {
      console.error(err);
    }

    const baseFormContainer =
      JSON.parse(localStorage.getItem("FormContainer")) || {};

    const finalConfirmationData = {
      orderId: id,
      OrderId2: secondaryId,
      orderData: orderData,
      paymentDetails: {
        PaymentMode: paymentMode,
        DeliveryMode: deliveryMode,
        RazorpayID: paymentData.PaymentID,
      },
      formContainer: { ...baseFormContainer, ...formContainer },
      priceDetails: { ...priceDetails, paidAmount: finalAmount },
    };

    localStorage.setItem(
      "OrderConfirmationData",
      JSON.stringify(finalConfirmationData),
    );

    const uploadForm = new FormData();
    uploadForm.append("payment", new Blob([JSON.stringify(paymentData)]));
    uploadForm.append("info", new Blob([JSON.stringify(formContainer)]));
    zipFile && uploadForm.append("zipfiles", zipFile);
    uploadForm.append("orderId", id);

    const excelData = JSON.parse(localStorage.getItem("excelfile")) || [];
    if (excelData[0]?.items?.length) {
      const ws = XLSX.utils.json_to_sheet(excelData[0].items);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      uploadForm.append(
        "excelfile",
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
    }

    const res = await fetch(`${apiEndPoint}/upload`, {
      method: "POST",
      body: uploadForm,
    });

    if (!res.ok) throw new Error("Upload failed");

    toast.success("🎉 Payment successful! Order saved.");
    navigate("/order-confirmation");
  };

  /* ---------------- PAYMENT ---------------- */
  const handlePayment = async () => {
    if (!sdkLoaded) return toast.error("Payment gateway not loaded");

    setIsLoading(true);

    let finalAmount =
      paymentMode === "partial-payment"
        ? Math.round(priceDetails.totalPrice / 2)
        : priceDetails.totalPrice;

    finalAmount = applyCoupon(finalAmount);

    const domain = window.location.hostname;

    const paymentData = {
      PaymentID: "TEST123456789",
      PaymentAmount: finalAmount,
      PaymentVender: "RazorPay",
      PaymentPoint: "PaymentPage",
      PaymentDiscountCode: testPayCode,
      PaymentMode: paymentMode,
      DeliveryMode: deliveryMode,
    };

    try {
      if (domain === "dreamik.com" || domain === "www.dreamik.com") {
        new window.Razorpay({
          key: "rzp_live_z50HzQG4hu7aR9",
          amount: finalAmount * 100,
          currency: "INR",
          handler: async (res) => {
            paymentData.PaymentID = res.razorpay_payment_id;
            await saveOrderDetails(paymentData, finalAmount);
          },
          modal: { ondismiss: () => setIsLoading(false) },
        }).open();
      } else {
        await saveOrderDetails(paymentData, finalAmount);
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = (amount) => {
    if (!testPayCode) return amount;

    // Test payment coupon
    if (testPayCode.startsWith("$TESTPAY$") && testPayCode.length === 19) {
      return amount > 100 ? amount / 100 : amount / 10;
    }

    // Discount coupon
    if (testPayCode.startsWith("$DISCOUNT$") && testPayCode.length === 20) {
      return amount > 100 ? amount / 10 : amount;
    }

    if (testPayCode == "TESTFORDEV") return 1;

    return amount;
  };

  return {
    orderData,
    priceDetails,
    deliveryMode,
    paymentMode,
    testPayCode,
    isLoading,
    orderId,
    isError,
    setTestPayCode,
    handlePayment,
    applyCoupon,
  };
};
