import React, { useContext, useState, useRef, useEffect } from "react";
import ResellerLogin from "./ResellerLogin";
import logo from "/logo.webp";
import menuIcon from "../assets/menu.png";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "./CartContext";
import { CiSearch } from "react-icons/ci";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { PiShoppingCart } from "react-icons/pi";
import { IoClose } from "react-icons/io5";

function Navbar({
  searchText,
  setSearchText,
  resellerLogin,
  setResellerLogin,
  setResellerProducts,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const [showResellerLogin, setShowResellerLogin] = useState(false);
  const [username, setUsername] = useState();
  const [userid, setUserid] = useState();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const productdropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleCartClick = () => {
    navigate("/Order"); // Navigate to the order/cart page
  };

  useEffect(() => {
    setSearchText("");
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("ResellerLogin");
    setShowAccountDropdown(false);
    setShowResellerLogin(false);
    setResellerLogin(false);
    setUsername(null);
    localStorage.removeItem("username");
    localStorage.removeItem("resid");
    localStorage.removeItem("ResellerProducts");
    localStorage.removeItem("Rescoup");
    localStorage.removeItem("address1");
    localStorage.removeItem("state");
    localStorage.removeItem("offercount");
    localStorage.removeItem("resellerform");
    window.location.reload();
  };

  const handleProductClick = (route) => {
    navigate(route);
    setShowProductsDropdown(false); // Close the dropdown after clicking an item
    setIsSearchActive(false);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const un = localStorage.getItem("username") || null;
    setUsername(un);
    const uid = localStorage.getItem("resid") || null;
    setUserid(uid);

    const handleOutsideClick = (e) => {
      if (
        productdropdownRef.current &&
        !productdropdownRef.current.contains(e.target)
      ) {
        setShowProductsDropdown(false);
        // setShowAccountDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value); // Update search text
  };

  const menuItems = [
    { label: "Cart", onClick: () => handleCartClick() },
    { label: "Reseller Login", onClick: () => setShowResellerLogin(true) },
    { label: "Name Slips", onClick: () => handleProductClick("/name-slip") },
    {
      label: "Cutout Nameslips",
      onClick: () => handleProductClick("/cutout-name-slip"),
    },
    { label: "Bulk Order", onClick: () => handleProductClick("/bulk-order") },
    {
      label: "Custom Nameslips",
      onClick: () => handleProductClick("/custom-name-slip"),
    },
  ];

  const searchfunction = async () => {
    if (searchText.trim() !== "") {
      try {
        const response = await fetch(
          "https://dreamik-intern.onrender.com/search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchTerm: searchText }),
          }
        );

        const result = await response.json();
        // console.log(result.message);
      } catch (error) {
        console.error("Error saving search:", error);
      }
    }
  };

  return (
    <>
      <nav className="w-full h-24 bg-[#12345A] px-4! py-3! shadow-md flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer md:w-auto w-1/3"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 md:w-[70px] md:h-[70px] rounded-full border-2 border-white"
          />
          <h2 className="text-white! text-[30px] leading-[27px] font-bold hidden md:block">
            Dreamik
          </h2>
        </div>

        <div className="w-full max-w-xl h-9! md:h-12! flex bg-white rounded-[10px] pl-4 pr-2 items-center shadow-md">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search products"
            className="flex-1 h-full text-sm px-2! outline-none border-none"
          />

          {/* Search Button */}
          <div
            onClick={searchfunction}
            className="h-[30px] md:h-[45px] w-[45px] bg-[#3E9D62]! rounded-xl flex items-center justify-center text-white mr-0.5! hover:cursor-pointer"
          >
            <CiSearch size={24} />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-[30px]! md:w-auto w-1/3 justify-end">
          {/* Cart */}
          <div
            className="hidden md:block relative cursor-pointer"
            onClick={handleCartClick}
          >
            <PiShoppingCart className="fill-white! w-[35px]! h-[35px]!" />
            <span className="w-6! h-6! flex flex-row justify-center items-center absolute -top-2 -right-2 bg-[#3E9D62] rounded-full text-[13px] text-white! text-center">
              {cartCount}
            </span>
          </div>

          <img
            src={menuIcon}
            alt="menu"
            onClick={() => setMenuOpen(true)}
            className="w-7 h-7 cursor-pointer invert"
          />
        </div>
      </nav>

      <ResellerLogin
        isOpen={showResellerLogin}
        onClose={() => setShowResellerLogin(false)}
        setUserid={setUserid}
        setUsername={setUsername}
        setResellerLogin={setResellerLogin}
        setResellerProducts={setResellerProducts}
      />

      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex flex-col gap-2!">
          <div className="flex flex-row items-center! justify-between! p-2!">
            <div
              className="flex items-center gap-3 cursor-pointer md:w-auto w-1/3"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="logo"
                className="w-[60px] h-[60px] rounded-full border-2 border-white"
              />
              <h2 className="text-[#12345A]! text-[30px] leading-[27px] font-bold">
                Dreamik
              </h2>
            </div>
            <div
              className="hover:bg-gray-200! hover:cursor-pointer p-1! rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <IoClose size={20} color="#1A1A1A" />
            </div>
          </div>
          <List sx={{ width: 260, mt: 2 }}>
            {menuItems.map((item, index) => (
              <ListItem disablePadding key={index}>
                <ListItemButton
                  onClick={() => {
                    item.onClick();
                    setMenuOpen(false);
                  }}
                  className="hover:bg-[#12345A]! hover:text-white! hover:font-medium! transition-all duration-300 ease-in"
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
