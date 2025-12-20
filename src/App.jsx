import { useState, useEffect, lazy, Suspense, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./index.css";
import "./style.css";
import Navbar from "./components/Nav";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Advertisement from "./components/Advertisement";

import ProductDetails from "./components/cutoutnameslip/ProductDetails";

import logo from "/logo.webp";
import CustomNameSlips from "./components/customnameslip/CustomNameSlips";
import CutOutNameSlip from "./components/cutoutnameslip/CutoutNameslip";

import ScrollToTop from "./components/ScrollTop";

import demoVideo from "/videos/demo video dreamik.mp4";
import customizevideo from "/videos/customizevideo.mp4";
import ProductList from "./components/ProductList";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Payment from "./components/payment/Payment";
import OrderConfirmation from "./components/orderconfirmation/OrderConfirmation";

const Order = lazy(() => import("./components/order/Order"));
const CustamizableBagTage = lazy(() =>
  import("./components/bagtag/CustamizableBagTage")
);
const PendingOrders = lazy(() => import("./components/PendingOrders"));

const Adminpanel = lazy(() => import("./components/adminpanel/Adminpanel"));
const AdminCouponTable = lazy(() =>
  import("./components/adminpanel/AdminCouponTable")
);
const Terms = lazy(() => import("./Terms"));
const BackgroundRemover = lazy(() =>
  import("./components/backgroundremover/BackgroundRemover")
);
const AiNameslipGen = lazy(() => import("./components/AiNameslipGen"));
const Location = lazy(() => import("./components/Location/location"));
const BulkPrinting = lazy(() => import("./components/BulkPrinting"));
const BulkOrder = lazy(() => import("./components/bulkorder/BulkOrder"));
const PageLogger = lazy(() => import("./components/pagelogger"));

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DemoVideos from "./AppComponents/DemoVideo/DemoVideos";
import SplashModal from "./components/SplashModal";
import Myorder from "./components/Myorder";
import NSPersonalize from "./components/Laserprinter";
import Fullcashondelivery from "./components/Fullcashondelivery";
import NameSlip from "./components/nameslip/NameSlips";
import NameSlipPersonalize from "./AppComponents/PersonalizeNameSlip/PersonalizeNameSlip";
import { GlobalStyles } from "@mui/material";
import NameSlipDetail from "./components/nameslip/NameSlipDetails";
import CutoutNameSlipPersonalize from "./components/cutoutnameslip/CutOutNameSlipPersonalize";
import OrderComp from "./AppComponents/Order/OrderComp";
import BirthdayCap from "./components/Birthdaycap/Birthdaycap";

function AppContent() {
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleht, setIsVisibleht] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [isVisiblecustomize, setIsVisiblecustomize] = useState(false);
  const [isvisiblecutout, setisvisiblecutout] = useState(true);
  const [ResellerLogin, setResellerLogin] = useState(false);
  const [ResellerProducts, setResellerProducts] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const [coupon, setcoupon] = useState("");

  const location = useLocation(); // This now works since it's inside Router
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = setTimeout(
      () => {
        setIsLoading(false);
      },
      location.pathname === "/" ? 2000 : 1000
    );

    return () => clearTimeout(timer); // Clears the previous timeout before setting a new one
  }, [location.pathname]);

  useEffect(() => {
    if (!sessionStorage.getItem("functionExecuted")) {
      sessionStorage.setItem("functionExecuted", true);
      // setShowSplash(true);
      setVisible(true);
    }

    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light-mode-only");
  }, []);

  useEffect(() => {
    const rl = localStorage.getItem("ResellerLogin") || false;
    setResellerLogin(rl);
    const resp = localStorage.getItem("ResellerProducts") || "";
    setResellerProducts(resp);
  }, []);

  const handleVideoClick = () => {
    setIsVisible(true);
    setIsVisibleht(true);
    setisvisiblecutout(true);
    setShowSplash(true);
  };

  const handleEditOrder = (prod) => {
    localStorage.setItem("editedproduct", JSON.stringify(prod));
  };

  const handlecustomizeVideoClick = () => {
    setShowSplash(true);
    setIsVisiblecustomize(true);
    setIsVisible(false);
  };

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>DreamikAI - Best AI Shop for Smart Products</title>
          <meta
            name="description"
            content="Buy AI-powered products at DreamikAI. Get the latest AI gadgets, tools, and accessories."
          />
          <meta
            name="keywords"
            content="AI shop, AI gadgets, artificial intelligence tools, smart devices"
          />
          <meta name="author" content="DreamikAI" />
          <meta name="robots" content="index, follow" />

          {/* Open Graph (Facebook, LinkedIn) */}
          <meta
            property="og:title"
            content="DreamikAI - Best AI Shop for Smart Products"
          />
          <meta
            property="og:description"
            content="Explore a range of AI-powered products, smart tools, and gadgets at DreamikAI."
          />
          <meta
            property="og:image"
            content="https://dreamik.com/splashscreenImages/splashscreenimage.webp"
          />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="DreamikAI - AI-Powered Products"
          />
          <meta
            name="twitter:description"
            content="Buy AI-powered gadgets and smart devices online at DreamikAI."
          />
          <meta
            name="twitter:image"
            content="https://dreamik.com/splashscreenImages/splashscreenimage.webp"
          />
        </Helmet>
        {isLoading ? (
          <div className="loading-screen">
            <img src={logo} alt="Loading..." className="loading-logo" />
          </div>
        ) : (
          <>
            <Suspense fallback={<div></div>}>
              {/* <SplashModal visible={visible} setVisible={setVisible} /> */}
              <PageLogger />
              <div className="flex flex-col gap-5">
                <div>
                  <Navbar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    resellerLogin={ResellerLogin}
                    setResellerLogin={setResellerLogin}
                    setResellerProducts={setResellerProducts}
                  />
                  <Advertisement />
                </div>
                <Routes>
                  {/* home page */}
                  <Route
                    path="/"
                    element={
                      <ProductList
                        searchText={searchText}
                        resellerlogin={ResellerLogin}
                        ResellerProducts={ResellerProducts}
                      />
                    }
                  />
                  {/* name slip */}
                  <Route
                    path="/Nameslips"
                    element={
                      <NameSlip
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setcoupon={setcoupon}
                      />
                    }
                  />
                  <Route
                    path="/name-slip/:productcode"
                    element={<NameSlipDetail />}
                  />
                  <Route
                    path="/name-slip/:templateID/:id"
                    element={<NameSlipPersonalize />}
                  />
                  {/* cut out name slip */}
                  <Route
                    path="/CutoutNameslips"
                    element={
                      <CutOutNameSlip
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setcoupon={setcoupon}
                      />
                    }
                  />
                  <Route
                    path="/cutOut-nameSlip/:id"
                    element={<ProductDetails />}
                  />
                  <Route
                    path="CNtemplate1/:id"
                    element={<CutoutNameSlipPersonalize />}
                  />
                  {/* bag tag */}
                  <Route
                    path="/CustamizableBagTage"
                    element={<CustamizableBagTage />}
                  />
                  <Route
                    path="/Order"
                    element={
                      <OrderComp
                        orderData={orderData}
                        setOrderData={setOrderData}
                        handleEditOrder={handleEditOrder}
                        coupon={coupon}
                      />
                    }
                  />
                  <Route path="/bulkorder" element={<BulkOrder />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route
                    path="/orderconfirmation"
                    element={<OrderConfirmation />}
                  />
                  <Route path="/pendingorders" element={<PendingOrders />} />
                  <Route
                    path="/customnameslips"
                    element={<CustomNameSlips />}
                  />
                  <Route
                    path="/fullcashondelivery"
                    element={<Fullcashondelivery />}
                  />
                  <Route path="/myorder" element={<Myorder />} />
                  <Route path="/location" element={<Location />} />
                  <Route path="/adminpanel" element={<Adminpanel />} />
                  <Route path="/termsandcondition" element={<Terms />} />
                  <Route
                    path="Bulkprintingsoftware"
                    element={<BulkPrinting />}
                  />
                  <Route
                    path="DreamikGlossyInkjet/LaserStickerPaperprinter(6x2)"
                    element={<NSPersonalize />}
                  />
                  <Route
                    path="/admincoupontable"
                    element={<AdminCouponTable />}
                  />
                  <Route
                    path="/AITextBehindImage(Free)"
                    element={<AiNameslipGen />}
                  />
                  {/* Birthday cap */}
                  <Route path="/BirthdayCap" element={<BirthdayCap />} />

                  <Route
                    path="/AIKickoutBackground(Free)"
                    element={<BackgroundRemover />}
                  />
                </Routes>

                {/* <SplashModal visible={isVisible} setVisible={setIsVisible} /> */}
                <div className="mt-10! flex flex-col gap-5!">
                  <DemoVideos
                    handleVideoClick={handleVideoClick}
                    handleCustomizeVideoClick={handlecustomizeVideoClick}
                    demoVideo={demoVideo}
                    customizeVideo={customizevideo}
                  />
                  <Newsletter />
                </div>
                <Footer />
              </div>
            </Suspense>
          </>
        )}
      </>
    </HelmetProvider>
  );
}

function App() {
  return (
    <Router>
      <div className="max-w-[1600px]! mx-auto! p-0!">
        <ToastContainer
          position="top-center"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        <ScrollToTop />
        <AppContent />
        <GlobalStyles
          styles={{
            body: {
              paddingRight: "0 !important",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
