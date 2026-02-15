import { useCallback } from "react";
import toast from "react-hot-toast";
import { apiEndPoint } from "../../appConfig";

export const useOrderActions = ({
  // state
  selectedvalue,
  deliveryMode,
  paymentMode,
  couponCode,
  couponUsed,
  initalprodprice,
  prodPrice,
  orderData,
  // setters
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
  // external
  removeFromCart,
  navigate,
  totalPrice,
  isReseller,
  zipFile,
  setIsLoading,
  offercount,
  setOffercount,
  setorderid,
}) => {
  /* ---------------- DELIVERY ---------------- */
  const handleDeliveryChange = useCallback(
    (e) => {
      const value = e.target.value;
      setDeliveryMode(value);

      if (value === "normal-delivery") {
        setDelPrice(selectedvalue === "instant" ? 70 : 50);
      } else if (value === "express-delivery") {
        setDelPrice(selectedvalue === "instant" ? 120 : 100);
      } else {
        setDelPrice(selectedvalue === "instant" ? 20 : 0);
      }
    },
    [selectedvalue, setDeliveryMode, setDelPrice],
  );

  /* ---------------- PAYMENT ---------------- */
  const handlePaymentChange = useCallback(
    (mode) => {
      setPaymentMode(mode);
      setCod(mode === "partial-payment" ? 40 : 0);
    },
    [setPaymentMode, setCod],
  );

  /* ---------------- COUPON INPUT ---------------- */
  const handleCouponChange = useCallback(
    (e) => setCouponCode(e.target.value),
    [setCouponCode],
  );

  /* ---------------- COUPON VALIDATION ---------------- */
  const validateCouponCode = (code = "") =>
    /^(#RO|#RP|#RP\$|#INF|DISCOUNT)/.test(code);

  /* ---------------- APPLY COUPON ---------------- */
  const applyCoupon = useCallback(
    (code = "") => {
      if (!validateCouponCode(code)) {
        toast.error("Invalid coupon");
        return;
      }

      let discount = 0;

      const updated = (orderData || []).map((prod) => {
        let d = 0;

        if (code.startsWith("#RO")) {
          setvisible(true);
          d =
            prod.labeltype === "matte"
              ? (10 * prod.price) / 100
              : (18.75 * prod.price) / 100;
        }

        if (code.startsWith("#RP")) {
          setvisiblerp(true);
          d =
            prod.labeltype === "matte"
              ? (85 * prod.price) / 100
              : (87.5 * prod.price) / 100;
        }

        if (code.startsWith("#INF")) {
          setInfluencer(true);
          d = prod.price;
        }

        discount += d;
        return { ...prod, discountedPrice: prod.price - d };
      });

      setdiscount1(discount);
      setOrderData(updated);
      setProdPrice((prev) => prev - discount);
      setCouponUsed(true);
    },
    [
      orderData,
      setOrderData,
      setProdPrice,
      setCouponUsed,
      setvisible,
      setvisiblerp,
      setdiscount1,
      setInfluencer,
    ],
  );

  /* ---------------- SUBMIT COUPON ---------------- */
  const handleSubmitCoupon = useCallback(() => {
    if (!couponCode) {
      toast.error("Enter coupon code");
      return;
    }

    if (couponUsed) {
      setCouponUsed(false);
      setProdPrice(initalprodprice);
      setvisible(false);
      setvisiblerp(false);
      return;
    }

    applyCoupon(couponCode);
  }, [
    couponCode,
    couponUsed,
    initalprodprice,
    applyCoupon,
    setCouponUsed,
    setProdPrice,
    setvisible,
    setvisiblerp,
  ]);

  /* ---------------- NORMAL / INSTANT ---------------- */
  const handleSelectOption = useCallback(
    (e) => {
      const val = e.target.value;
      setselectedvalue(val);

      if (val === "instant") {
        setDelPrice(
          deliveryMode === "normal-delivery"
            ? 70
            : deliveryMode === "express-delivery"
              ? 120
              : 20,
        );
      } else {
        setDelPrice(
          deliveryMode === "normal-delivery"
            ? 50
            : deliveryMode === "express-delivery"
              ? 100
              : 0,
        );
      }
    },
    [deliveryMode, setselectedvalue, setDelPrice],
  );

  /* ---------------- PINCODE ---------------- */
  const fetchLocation = useCallback(
    async (pin) => {
      setpincode(pin);

      if (pin?.length !== 6) return null;

      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();

        if (data?.[0]?.Status === "Success") {
          const po = data[0]?.PostOffice?.[0];
          if (!po) return null;
          return po;
        } else {
          toast.error("Invalid Pincode");
          return null;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [setpincode],
  );

  /* ---------------- REMOVE PRODUCT ---------------- */
  const removeProduct = useCallback(
    (prod) => {
      const updated = (orderData || []).filter((p) => p !== prod);
      localStorage.setItem("OrderData", JSON.stringify(updated));
      setOrderData(updated);
      removeFromCart();
    },
    [orderData, setOrderData, removeFromCart],
  );

  // helper function

  const generateRandomString = (length = 5) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  /* ---------------- PROCEED ---------------- */
  const handleProceedToPayment = async (formValues) => {
    // 1. Validation
    if (!orderData?.length) {
      toast.error("Add at least one product");
      return;
    }

    setIsLoading(true);

    // 2. Map Product Details (Restoring Font/Style Metadata)
    const productDetails = (orderData || []).map((product) => {
      const labels = Array.isArray(product.labels) ? product.labels : [];
      const selectedlabel = localStorage.getItem("selectedlabel") || "";
      const dynamicKey =
        selectedlabel === "/image/waterlabel/4.png" ? "contact no" : "rollno";

      return {
        ProdName: product?.Name || "",
        productcode: product.productcode || "",
        product: product.productcode?.startsWith("NS")
          ? "nameslip"
          : product.productcode?.startsWith("NSCRT")
            ? "cutoutNameslip"
            : "",
        price: product.price || 0,
        size: product.size || "",
        quantity: product.quantity || 0,
        subquantity: product?.size?.includes("OneSheet totally")
          ? "4 sheets"
          : "3 sheets",
        type: product.labeltype || "",
        // Restoring the font/style logic required for printing
        name: labels[0]?.text || "",
        "name fontsize": labels[0]?.fontSize || "",
        "name fontColor": labels[0]?.fontColor || "",
        "name fontFamily": labels[0]?.fontFamily || "",
        "name fontStyle": labels[0]?.fontStyle || "",
        school: labels[1]?.text || "",
        "school fontsize": labels[1]?.fontSize || "",
        "school fontColor": labels[1]?.fontColor || "",
        "schooln fontFamily": labels[1]?.fontFamily || "",
        "school fontStyle": labels[1]?.fontStyle || "",
        subject: labels[2]?.text || "",
        "subject fontsize": labels[2]?.fontSize || "",
        "subject Position": labels[2]?.position || "",
        [dynamicKey]: labels[3]?.text || "",
        [`${dynamicKey} fontsize`]: labels[3]?.fontSize || "",
        section: labels[4]?.text || "",
        class: labels[5]?.text || "",
      };
    });

    // 3. Prepare Form Data
    const formData = {
      version: "Dreamik.com_v1.1",
      name: formValues.name?.trim() || "",
      email: formValues.email || "",
      phone: formValues.phone?.trim() || "",
      whatsappno: formValues.whatsappno || "",
      address1: formValues.address1 || "",
      address2: formValues.address2 || "",
      digipin: formValues.digipin || "",
      pincode: formValues.pincode || "",
      district: formValues.district || "",
      state: formValues.state || "",
      landmark: formValues.landmark || "",
      customertype: isReseller ? "reseller" : "customer",
      discount: discount1 || 0,
      shippingcost: delPrice,
      resellerid: localStorage.getItem("Rescoup") || "NIL",
      coupon: couponCode || "",
      totalprice: totalPrice,
      deliverymode: deliveryMode,
      paymentmode: paymentMode,
      productDetails: productDetails,
      additionalDetails: {
        orderTime: new Date().toString(),
        browserDetails: navigator.userAgent,
      },
    };

    // 4. Persistence to LocalStorage
    try {
      localStorage.setItem(
        "PriceData",
        JSON.stringify({ prodPrice, delPrice, cod, totalPrice }),
      );
      localStorage.setItem(
        "PaymentDetails",
        JSON.stringify({
          deliveryMode,
          paymentMode,
          prodPrice,
          delPrice,
          cod,
          totalPrice,
        }),
      );
      localStorage.setItem("FormContainer", JSON.stringify(formData));
    } catch (err) {
      toast.error("Local storage full. Please clear cart and try again.");
      setIsLoading(false);
    }

    // 5. Handling Order Logic (COD vs Online)
    if (paymentMode === "cashon-payment" || influencer) {
      try {
        const now = new Date();
        const prefix = paymentMode === "cashon-payment" ? "COD-order" : "INF";
        const orderId = `${prefix}-${formData.name}${now.toISOString().replace(/[-:.TZ]/g, "")}-${generateRandomString()}-v1`;
        setorderid(orderId);

        // A. Generate Secondary ID from AWS
        let OrderId2 = null;
        const resId = influencer ? "INF" : couponCode ? "CPN" : "CS"; // Logic for requesterid

        const idRes = await fetch(
          "https://0xij5t5kzk.execute-api.ap-south-1.amazonaws.com/prod/generate-id",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              invoiceid: orderId,
              requesterid: resId,
              requestmobil: formData.phone,
              option: "none",
            }),
          },
        );

        if (idRes.ok) {
          const idData = await idRes.json();
          OrderId2 = idData.orderid;
        }

        const orderDetails = {
          orderId,
          OrderId2,
          orderData,
          paymentDetails: {
            PaymentMode: paymentMode,
            DeliveryMode: deliveryMode,
          },
          formContainer: formData,
          priceDetails: { prodPrice, delPrice, cod, totalPrice },
        };

        // Crucial: This is what the /order-confirmation page reads to show the success message
        localStorage.setItem(
          "OrderConfirmationData",
          JSON.stringify(orderDetails),
        );

        // B. Upload Files and JSON to Server
        const uploadForm = new FormData();
        const infoBlob = new Blob([JSON.stringify(formData)], {
          type: "application/json",
        });
        uploadForm.append("info", infoBlob, "info.json");
        uploadForm.append("orderId", orderId);
        if (zipFile) uploadForm.append("zipfiles", zipFile, "order_images.zip");

        const response = await fetch(`${apiEndPoint}/upload`, {
          method: "POST",
          body: uploadForm,
        });

        if (response.ok) {
          // C. Update Reseller Offer Count
          if (offercount) {
            const newCount = Math.max(offercount - 1, 0);
            setOffercount(newCount);
            localStorage.setItem("offercount", newCount);

            await fetch(
              `${apiEndPoint}/updateReseller/${resellerformdata.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...resellerformdata,
                  offercount: newCount,
                }),
              },
            );
          }

          toast.success("Order saved successfully!");
          navigate("/order-confirmation");
        } else {
          setIsLoading(false);
          throw new Error("Server upload failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to process order. Please try again.");
        setIsLoading(false);
      }
    } else {
      const orderDetails = {
        orderData,
        formContainer: formData,
        priceDetails: { prodPrice, delPrice, cod, totalPrice },
      };

      localStorage.setItem(
        "OrderConfirmationData",
        JSON.stringify(orderDetails),
      );
      navigate("/payment");
    }
  };

  return {
    handleDeliveryChange,
    handlePaymentChange,
    handleCouponChange,
    handleSubmitCoupon,
    handleSelectOption,
    fetchLocation,
    removeProduct,
    handleProceedToPayment,
  };
};
