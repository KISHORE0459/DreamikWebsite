import { FaStar } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";

const ProductCard = ({
  product,
  resellerLogin,
  ResellerProducts,
  diffInSeconds,
  handleClick,
}) => {
  const isAllowed = resellerLogin
    ? ResellerProducts?.includes(product?.name)
    : true;

  return (
    <div
      onClick={() => isAllowed && !product?.outOfStock && handleClick(product)}
      className={`relative bg-white rounded-[10px]! shadow-md hover:shadow-xl cursor-pointer transition border! border-gray-300! w-[310px]!
              ${
                isAllowed && !product?.outOfStock
                  ? "opacity-100"
                  : "opacity-50 pointer-events-none"
              }`}
    >
      {/* Offer tag */}
      {["Cutout Nameslips", "Name Slips"]?.includes(product?.name) &&
        diffInSeconds > 5 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
            1+1 Offer
          </div>
        )}

      <div className="w-full! overflow-hidden h-[140px]! rounded-[10px]!">
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover hover:scale-[102%] transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2.5! px-2! py-4! items-start!">
        <div className="flex flex-col gap-1!">
          <div className="flex flex-col gap-0">
            <h4 className="text-[10px]! text-[#545454]! font-normal! leading-5! text-left">
              {product?.category}
            </h4>
            <div className="flex flex-row items-center gap-1">
              <h3 className="text-[16px]! text-[#1A1A1A]! font-medium! leading-5! text-left">
                {product?.name}
              </h3>
              {product?.pieces && (
                <span className="block text-xs font-normal text-gray-500">
                  {product?.pieces}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-[3px]!">
            {Array?.from({ length: product?.rating })?.map((val, idx) => (
              <FaStar
                fill="#E3BE36"
                key={val + idx}
                className="w-3 h-3 shrink-0"
              />
            ))}
            <h4 className="text-[12px]! text-[#3C3C3C]! font-normal leading-4">{`(${product?.rating})`}</h4>
          </div>
        </div>

        <div className="flex flex-row items-center gap-px">
          <MdCurrencyRupee className="w-[13px] h-[13px]" fill="#3E9D62" />
          <p className="text-[16px]! font-medium text-[#3E9D62]! leading-5">
            {product?.price}
          </p>
        </div>

        {/* Out of Stock */}
        {product.outOfStock && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs p-2! rounded">
            Out of Stock
          </span>
        )}

        {/* Not for reseller */}
        {!isAllowed && (
          <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
            Not for you
          </span>
        )}

        <button className="bg-[#1A335E]! h-10 w-[280px] rounded-lg text-[13px]! text-white! font-medium! flex justify-center items-center transition-all duration-200 hover:cursor-pointer!">
          Personalize and Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
