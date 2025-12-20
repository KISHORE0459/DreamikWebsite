import { useCallback } from "react";

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
  setDelPrice,
  setCod,
  setCouponCode,
  setCouponUsed,
  setvisible,
  setvisiblerp,
  setdiscount1,
  setProdPrice,
  setOrderData,
  setInfluencer,
  setpincode,
  // external
  removeFromCart,
  navigate,
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
    [selectedvalue, setDeliveryMode, setDelPrice]
  );

  /* ---------------- PAYMENT ---------------- */
  const handlePaymentChange = useCallback(
    (mode) => {
      setPaymentMode(mode);
      setCod(mode === "partial-payment" ? 40 : 0);
    },
    [setPaymentMode, setCod]
  );

  /* ---------------- COUPON INPUT ---------------- */
  const handleCouponChange = useCallback(
    (e) => setCouponCode(e.target.value),
    [setCouponCode]
  );

  /* ---------------- COUPON VALIDATION ---------------- */
  const validateCouponCode = (code) =>
    /^(#RO|#RP|#RP\$|#INF|DISCOUNT)/.test(code);

  /* ---------------- APPLY COUPON ---------------- */
  const applyCoupon = useCallback(
    (code) => {
      if (!validateCouponCode(code)) {
        alert("Invalid coupon");
        return;
      }

      let discount = 0;

      const updated = orderData.map((prod) => {
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
      setProdPrice(prodPrice - discount);
      setCouponUsed(true);
    },
    [
      orderData,
      prodPrice,
      setOrderData,
      setProdPrice,
      setCouponUsed,
      setvisible,
      setvisiblerp,
      setdiscount1,
      setInfluencer,
    ]
  );

  /* ---------------- SUBMIT COUPON ---------------- */
  const handleSubmitCoupon = useCallback(() => {
    if (!couponCode) {
      alert("Enter coupon code");
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
            : 20
        );
      } else {
        setDelPrice(
          deliveryMode === "normal-delivery"
            ? 50
            : deliveryMode === "express-delivery"
            ? 100
            : 0
        );
      }
    },
    [deliveryMode, setselectedvalue, setDelPrice]
  );

  /* ---------------- PINCODE ---------------- */
  const fetchLocation = useCallback(
    (pin) => {
      setpincode(pin);
      if (pin?.length !== 6) return;

      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0]?.Status === "Success") {
            const po = data[0].PostOffice[0];
            document.getElementById("district").value = po.District;
            document.getElementById("state").value = po.State;
          } else {
            alert("Invalid Pincode");
          }
        });
    },
    [setpincode]
  );

  /* ---------------- REMOVE PRODUCT ---------------- */
  const removeProduct = useCallback(
    (prod) => {
      const updated = orderData.filter((p) => p !== prod);
      localStorage.setItem("OrderData", JSON.stringify(updated));
      setOrderData(updated);
      removeFromCart();
    },
    [orderData, setOrderData, removeFromCart]
  );

  /* ---------------- PROCEED ---------------- */
  const handleProceedToPayment = useCallback(() => {
    if (!orderData.length) {
      alert("Add at least one product");
      return;
    }

    localStorage.setItem(
      "PaymentDetails",
      JSON.stringify({ deliveryMode, paymentMode })
    );

    navigate(
      paymentMode === "cashon-payment" ? "/orderconfirmation" : "/payment"
    );
  }, [orderData, deliveryMode, paymentMode, navigate]);

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
