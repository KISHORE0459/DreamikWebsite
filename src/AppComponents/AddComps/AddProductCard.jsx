const AddProductCard = ({
  product,
  ResellerProducts,
  resellerLogin,
  handleClick,
}) => {
  const isAllowed = resellerLogin
    ? ResellerProducts?.includes(product?.name)
    : true;

  const hideForUser =
    !resellerLogin &&
    ["Dreamik Glossy Inkjet/Laser printer", "Bulk printing software"]?.includes(
      product?.name
    );

  if (hideForUser) return null;

  return (
    <div
      onClick={() => isAllowed && !product?.outOfStock && handleClick(product)}
      className={`flex flex-col gap-2 items-center min-w-[90px] max-w-[150px] cursor-pointer transition ${
        isAllowed && !product?.outOfStock
          ? "opacity-100"
          : "opacity-50 pointer-events-none"
      }`}
    >
      <img
        src={product?.logo}
        className="w-16 h-16 object-cover rounded-md"
        alt={product?.name}
      />
      <p className="text-[12px]! font-medium text-gray-700 mt-1 text-center">
        {product?.logoName}
      </p>
    </div>
  );
};

export default AddProductCard;
