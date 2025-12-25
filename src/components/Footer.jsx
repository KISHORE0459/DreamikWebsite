import logo from "/logo.webp";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Footer() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1️⃣ Contact details (dynamic)
  const contactItems = [
    {
      label: "Address",
      value:
        "MURVEN Infotech Design Solutions LLP, 715-A, 7th Floor, Spencer Plaza, Suite No.548, Mount Road, Anna Salai, Chennai-600002, Tamil Nadu, India.",
    },
    { label: "Phone", value: "+91-44-28505188" },
    {
      label: "Email",
      value: "dreamikai@gmail.com",
      link: "mailto:dreamikai@gmail.com",
    },
    {
      label: "Whatsapp",
      value: "+919498088659",
      link: "https://wa.me/+919498088659",
    },
    { label: "GST", value: "33ABPFM6846A1Z8" },
  ];

  // 2️⃣ Menu links (no buttons)
  const menuLinks = [
    { name: "Dreamik AI", action: () => navigate("/") },
    { name: "Admin Panel", action: () => navigate("/adminpanel") },
    { name: "Privacy Policy", external: "/privacy.html" },
    {
      name: "Terms & Conditions",
      action: () => navigate("/termsandcondition"),
    },
    { name: "Return & Refund", external: "/refund.html" },
    { name: "Contact Us" },
  ];

  // 3️⃣ My Account links (no buttons)
  const accountLinks = [
    { name: "Sign In" },
    { name: "View Cart", action: () => navigate("/Order") },
    { name: "My Wishlist" },
    { name: "Track My Order", action: () => navigate("/myorder") },
    { name: "Pending Orders", action: () => navigate("/pendingorders") },
    { name: "Reseller Details", action: () => navigate("/location") },
    {
      name: "Feedback",
      external:
        "https://docs.google.com/forms/d/e/1FAIpQLScO4MlvWy3ZuLNy1e_aifz7EP-Lfypva2nc6mgzOTVFLnGHlw/viewform",
    },
  ];

  const socialMediaLinks = [
    {
      icon: "fab fa-facebook",
      link: "https://www.facebook.com/dreamikai",
    },
    {
      icon: "fab fa-twitter",
      link: "https://twitter.com/dreamikaicomics",
    },
    {
      icon: "fab fa-instagram",
      link: "https://www.instagram.com/dreamik.ai/",
    },
    {
      icon: "fab fa-youtube",
      link: "https://www.youtube.com/channel/UC4B8UinlrPeW4yY0yPc37Tg",
    },
  ];

  return (
    <footer className="w-full bg-[#002855]! text-white py-12! px-6! flex! flex-col! gap-10!">
      {/* GRID */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center items-start">
        {/* 1️⃣ LOGO + CONTACT */}
        <div className="flex flex-col gap-4 col-span-2">
          <div
            className="flex items-center gap-3 cursor-pointer w-fit"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="logo"
              className="w-[70px] h-[70px] rounded-full border-2 border-white"
            />
            <h2 className="text-white! text-[30px] font-bold">Dreamik</h2>
          </div>

          {contactItems.map((item, idx) => (
            <p
              key={idx}
              className="text-[12px] md:text-[14px] !text-white leading-5 !py-1 text-left"
            >
              <strong>{item.label}:</strong>{" "}
              {item.link ? (
                <a href={item.link} target="_blank" className="text-white!">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </p>
          ))}
        </div>

        {/* 2️⃣ MENU LINKS */}
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-[18px] md:text-[24px] font-semibold mb-1 text-white!">
            Menu
          </h3>

          {menuLinks.map((item, idx) => (
            <span
              key={idx}
              onClick={item.action}
              className="text-[12px] md:text-[14px] text-white! cursor-pointer py-1! hover:scale-110! transition-all duration-300"
            >
              {item.external ? (
                <a href={item.external} className="text-white!">
                  {item.name}
                </a>
              ) : (
                item.name
              )}
            </span>
          ))}
        </div>

        {/* 3️⃣ MY ACCOUNT LINKS */}
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-[18px] md:text-[24px] font-semibold mb-1 !text-white">
            My Account
          </h3>

          {accountLinks.map((link, idx) => (
            <span
              key={idx}
              onClick={link.action}
              className="text-[12px] md:text-[14px] text-white! cursor-pointer py-1! hover:scale-110! transition-all duration-300"
            >
              {link.external ? (
                <a href={link.external} target="_blank">
                  {link.name}
                </a>
              ) : (
                link.name
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold !text-white">Follow Us</h3>

        <div className="flex gap-6">
          {socialMediaLinks?.map((icon, idx) => (
            <a
              key={idx}
              href={icon.link}
              target="_blank"
              className="w-[30px] h-[30px] text-white! flex items-center justify-center text-2xl hover:text-[#3E9D62]!"
            >
              <i className={icon.icon}></i>
            </a>
          ))}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="flex flex-col gap-1! text-center text-sm text-gray-50! mt-10 border-t border-gray-600 pt-4!">
        <p className="text-gray-50!">
          © 2024 by Dreamik AI. Created by Sanads Digital
        </p>
        <p className="text-gray-50!">Version: 1.1.2</p>
      </div>
    </footer>
  );
}

export default Footer;
