import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import OnePlusOneOffer from "../cutoutnameslip/Oneplusone";
import { Pagination } from "@mui/material";
import NameSlipCard from "../../AppComponents/NameSlipCard/NameSlipCard";
import { useQuery } from "@tanstack/react-query";
import AppLoader from "../../AppComponents/AppLoader/AppLoader";

const PRODUCTS_PER_PAGE = 20;

const NameSlip = ({ searchText, setSearchText, setcoupon }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState({});
  const navigate = useNavigate();
  const imgRefs = useRef([]);
  const [selectedImage, setSelectedImage] = useState(
    sessionStorage.getItem("personImage") || null
  );
  const [studentDetails, setStudentDetails] = useState(
    JSON.parse(sessionStorage.getItem("studentDetails")) || null
  );
  const fontdetails = JSON.parse(sessionStorage.getItem("detailsFont")) || null;

  const [page, setPage] = useState(1);

  // fetch products (preserved)
  const {
    data: nameSlipList,
    isLoading: isNameSlipListLoading,
    isFetching: isNameSlipListFetching,
  } = useQuery({
    queryKey: ["NameSlipList"],
    queryFn: async () => {
      const res = await fetch("../nameslip_data.json");
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
    setcoupon && setcoupon("DISCOUNTNSR20");
  }, [nameSlipList, isNameSlipListLoading, isNameSlipListFetching, setcoupon]);

  const normalizeString = (str = "") => str.replace(/\s+/g, "").toLowerCase();
  useEffect(() => {
    if (searchText) {
      const filtered = products.filter(
        (product) =>
          normalizeString(product.name).includes(normalizeString(searchText)) ||
          (product.props &&
            product.props.some((prop) =>
              normalizeString(prop).includes(normalizeString(searchText))
            ))
      );
      setFilteredProducts(filtered);
      setPage(1);
    } else {
      setFilteredProducts(products);
      setPage(1);
    }
  }, [searchText, products]);

  // lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset?.src) img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.2 }
    );
    imgRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });
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

  // navigation - preserved
  const handleProductClick = (id, productcode) => {
    localStorage.setItem("keyid", id);
    navigate(`/name-slip/${productcode}`);
  };

  // filter handlers (apply simple filters locally)
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

  // helper to set imgRefs from child
  const imgRefSetter = (index, el) => {
    imgRefs.current[index] = el;
  };

  if (isNameSlipListFetching || isNameSlipListLoading) {
    return <AppLoader />;
  }

  return (
    <HelmetProvider>
      <div className="px-4! md:px-8! flex flex-col gap-5!">
        <OnePlusOneOffer offerproduct={"Nameslips"} />

        {/* Top bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between min-h-[100px] w-full px-21 md:px-10! border-b border-b-[#1A335E] py-2! gap-5!">
          <div className="flex flex-col gap-1 items-start">
            <h4 className="text-[24px] text-[#1A1A1A] font-medium leading-5">
              Name Slips
            </h4>
            <h4 className="text-[14px] text-[#383838] font-normal leading-5">
              Customize and have Fun
            </h4>
          </div>
          <div className="flex flex-row items-center justify-between gap-3 mb-6">
            <div className="w-full max-w-xl h-9! md:h-10! flex bg-white rounded-[10px] pl-4 pr-2 items-center shadow-md">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products"
                className="flex-1 h-full text-sm px-2! w-[200px] md:w-[300px] border! border-[#1A1A1A] rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center justify-center md:items-stretch">
          {paginated.map((product, idx) => {
            const globalIndex = (page - 1) * PRODUCTS_PER_PAGE + idx;
            return (
              <div
                key={product.id || globalIndex}
                onMouseEnter={() => {
                  setHoveredIndex(globalIndex);
                  setGalleryIndex((prev) => ({ ...prev, [globalIndex]: 0 }));
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <NameSlipCard
                  product={product}
                  globalIndex={globalIndex}
                  isHovered={hoveredIndex === globalIndex}
                  galleryIndex={galleryIndex[globalIndex]}
                  imgRefSetter={imgRefSetter}
                  selectedImage={selectedImage}
                  studentDetails={studentDetails}
                  fontdetails={fontdetails}
                  onClickCard={handleProductClick}
                  onCtaClick={(id) => navigate(`/NSPersonalize/${id}`)}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
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

export default NameSlip;
