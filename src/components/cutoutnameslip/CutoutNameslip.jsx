import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import OnePlusOneOffer from "./Oneplusone";
import { Pagination } from "@mui/material";
import NameSlipCard from "../../AppComponents/NameSlipCard/NameSlipCard";
import { useQuery } from "@tanstack/react-query";
import AppLoader from "../../AppComponents/AppLoader/AppLoader";

const PRODUCTS_PER_PAGE = 20;

const CutOutNameSlip = ({ searchText, setSearchText, setcoupon }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState({});
  const navigate = useNavigate();
  const imgRefs = useRef([]);

  const [page, setPage] = useState(1);

  // fetch products

  const {
    data: nameSlipList,
    isLoading: isNameSlipListLoading,
    isFetching: isNameSlipListFetching,
  } = useQuery({
    queryKey: ["CutOutNameSlip"],
    queryFn: async () => {
      const res = await fetch("../cutoutnameslip_data.json");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  useEffect(() => {
    if (nameSlipList) {
      const filteredProducts = Object.keys(nameSlipList)
        .filter((key) => nameSlipList[key].status === 1)
        .map((key) => ({ ...nameSlipList[key], id: key }));
      setProducts(filteredProducts);
      setFilteredProducts(filteredProducts);
    }
    setcoupon && setcoupon("DISCOUNTCONSR50");
  }, [nameSlipList, isNameSlipListLoading, isNameSlipListFetching, setcoupon]);

  // normalize search
  const normalize = (str = "") => str.replace(/\s+/g, "").toLowerCase();

  useEffect(() => {
    if (searchText) {
      const f = products.filter(
        (p) =>
          normalize(p.name).includes(normalize(searchText)) ||
          (p.props &&
            p.props.some((prop) =>
              normalize(prop).includes(normalize(searchText))
            ))
      );
      setFilteredProducts(f);
      setPage(1);
    } else {
      setFilteredProducts(products);
      setPage(1);
    }
  }, [searchText, products]);

  // lazy load observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset?.src) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    imgRefs.current.forEach((img) => img && observer.observe(img));
    return () => observer.disconnect();
  }, [filteredProducts, page]);

  // hover gallery cycle
  useEffect(() => {
    if (
      hoveredIndex !== null &&
      filteredProducts[hoveredIndex]?.gallery?.length > 1
    ) {
      const interval = setInterval(() => {
        setGalleryIndex((prev) => ({
          ...prev,
          [hoveredIndex]:
            ((prev[hoveredIndex] || 0) + 1) %
            filteredProducts[hoveredIndex].gallery.length,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [hoveredIndex, filteredProducts]);

  // navigation
  const handleProductClick = (id, productcode) => {
    localStorage.setItem("keyid", id);
    navigate(`/cutout-name-slip/${productcode}`);
  };

  // filter drawer options
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );
  const templates = Array.from(
    new Set(products.map((p) => p.template).filter(Boolean))
  );

  // pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginated = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const imgRefSetter = (index, el) => {
    imgRefs.current[index] = el;
  };

  if (isNameSlipListFetching || isNameSlipListLoading) {
    return <AppLoader />;
  }

  return (
    <HelmetProvider>
      <div className="px-4! md:px-8! flex flex-col gap-5!">
        <OnePlusOneOffer offerproduct="CutoutNameslips" />

        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between 
          min-h-[100px] w-full px-2 md:px-10 border-b border-b-[#1A335E] py-3 gap-5"
        >
          <div className="flex flex-col gap-1 items-start">
            <h4 className="text-[24px] font-medium text-[#1A1A1A] leading-5">
              Cut Out Name Slips
            </h4>
            <h4 className="text-[14px] text-[#383838] leading-5">
              Creative and Fun
            </h4>
          </div>

          {/* SEARCH + FILTER BUTTON */}
          <div className="flex flex-row items-center gap-3 mb-6">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products"
              className="flex-1 w-[200px] md:w-[300px] h-10 text-sm px-2! border border-[#1A1A1A] rounded-lg"
            />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
          gap-6 place-items-center md:items-stretch"
        >
          {paginated.map((product, idx) => {
            const global = (page - 1) * PRODUCTS_PER_PAGE + idx;
            return (
              <div
                key={product.id}
                onMouseEnter={() => {
                  setHoveredIndex(global);
                  setGalleryIndex((prev) => ({ ...prev, [global]: 0 }));
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <NameSlipCard
                  product={product}
                  globalIndex={global}
                  isHovered={hoveredIndex === global}
                  galleryIndex={galleryIndex[global]}
                  imgRefSetter={imgRefSetter}
                  selectedImage={null} // plain image only
                  studentDetails={null}
                  fontdetails={null}
                  onClickCard={handleProductClick}
                  onCtaClick={(id) => navigate(`/CutoutPersonalize/${id}`)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => {
              setPage(value);
              window.scrollTo({ top: 200, behavior: "smooth" });
            }}
            color="primary"
          />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default CutOutNameSlip;
