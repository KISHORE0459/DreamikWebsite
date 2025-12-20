const CustomNameSlipCheckOutSection = ({
  quantity,
  setQuantity,
  price,
  handleAddToCart,
  handleDownload,
  sendToWhatsApp,
}) => {
  return (
    <div className="checkout-section">
      <div>
        Quantity
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
        />
      </div>

      <div className="price">Rs. {price * quantity}</div>

      <button onClick={handleAddToCart}>Add to cart</button>

      <button onClick={sendToWhatsApp}>WhatsApp Support</button>

      <button onClick={handleDownload}>Download Image</button>
    </div>
  );
};

export default CustomNameSlipCheckOutSection;
