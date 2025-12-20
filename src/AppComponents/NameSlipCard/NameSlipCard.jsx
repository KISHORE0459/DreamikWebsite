import { FaStar } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";

const NameSlipCard = ({
  product,
  globalIndex,
  isHovered,
  galleryIndex,
  imgRefSetter,
  selectedImage,
  studentDetails,
  fontdetails,
  onClickCard,
  onCtaClick,
}) => {
  return (
    <div
      className="relative bg-white rounded-[10px]! shadow-md hover:shadow-xl cursor-pointer transition border! border-[#ADADAD]! w-[310px]!"
      onClick={() => onClickCard(product.id, product.productcode)}
    >
      {/* Offer badge */}
      {product.offer && (
        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full z-10">
          {product.offer}
        </div>
      )}

      {/* image block (fills card width) */}
      <div className="w-full h-[170px] bg-gray-100 relative rounded-[10px]! overflow-hidden!">
        <img
          ref={(el) => imgRefSetter(globalIndex, el)}
          data-src={product.source}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* keep overlay/images for special templates - preserved from original */}
        {["template4", "template8", "template12"].includes(
          product.template
        ) && (
          <div
            className={`absolute ${
              ["template12"]?.includes(product?.template)
                ? "right-2 top-2 w-[75px] h-[100px]"
                : "left-1 top-4 w-[90px] h-[90px]"
            }`}
          >
            <img
              src={
                selectedImage ||
                `/demokidspictures/demokidsimage${(globalIndex % 12) + 1}.webp`
              }
              alt="kid"
              className={`border-2 border-white w-full h-full object-cover ${
                ["template4", "template8"]?.includes(product?.template)
                  ? "rounded-full"
                  : "rounded-[10px]"
              }`}
            />
          </div>
        )}

        {/* gallery preview on hover */}
        {isHovered &&
          product.gallery &&
          ["template8", "template3", "template12", "template9"].includes(
            product.template
          ) &&
          product.gallery.length > 0 && (
            <div className="absolute top-0 right-0 w-full h-full rounded-md overflow-hidden border">
              <img
                src={product.gallery[galleryIndex || 0]}
                alt="gallery"
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
        </div>

        <div className="flex flex-row items-center gap-1!">
          <div className="flex flex-row items-center gap-px">
            <h4 className="text-[12px]! text-[#1A1A1A] font-normal leading-4">
              Matte :
            </h4>
            <MdCurrencyRupee className="w-[13px] h-[13px]" fill="#3E9D62" />
            <p className="text-[16px]! font-medium text-[#3E9D62]! leading-5">
              {product?.price}
            </p>
          </div>
          <div>/</div>
          <div className="flex flex-row items-center gap-px">
            <h4 className="text-[12px]! text-[#1A1A1A] font-normal leading-4">
              Glossy :
            </h4>
            <MdCurrencyRupee className="w-[13px] h-[13px]" fill="#3E9D62" />
            <p className="text-[16px]! font-medium text-[#3E9D62]! leading-5">
              {product?.price + product?.glossy}
            </p>
          </div>
        </div>

        {/* Out of Stock */}
        {product.outOfStock && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs p-2! rounded">
            Out of Stock
          </span>
        )}

        <button
          className="bg-[#1A335E]! h-10 w-[280px] rounded-lg text-[13px]! text-white! font-medium! flex justify-center items-center hover:font-semibold! hover:scale-[101%] transition-all duration-200"
          onClick={() => onClickCard(product.id, product.productcode)}
        >
          Personalize and Add to Cart
        </button>
      </div>
    </div>
  );
};

export default NameSlipCard;
