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

const BackgroundRemover = lazy(
  () => import("./components/backgroundremover/BackgroundRemover"),
);
const PageLogger = lazy(() => import("./components/pagelogger"));

import DemoVideos from "./AppComponents/DemoVideo/DemoVideos";
import SplashModal from "./components/SplashModal";
import Myorder from "./components/Myorder";
import FullCashOnDelivery from "./components/Fullcashondelivery";
import NameSlip from "./components/nameslip/NameSlips";
import NameSlipPersonalize from "./AppComponents/PersonalizeNameSlip/PersonalizeNameSlip";
import { GlobalStyles } from "@mui/material";
import NameSlipDetail from "./components/nameslip/NameSlipDetails";
import CutoutNameSlipPersonalize from "./components/cutoutnameslip/CutOutNameSlipPersonalize";
import OrderComp from "./AppComponents/Order/OrderComp";
import BirthdayCap from "./components/Birthdaycap/Birthdaycap";
import BulkOrder from "./components/bulkorder/BulkOrder";
import TextBehindImage from "./components/TextBehindImage/TextBehindImage";
import BulkPrinting from "./components/BulkPrinting/BulkPrinting";
import Poster from "./components/Poster/Poster";
import CustomSticker from "./components/Sticker/Sticker";
import LaserPrinting from "./components/LaserPrinting/LaserPrinting";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import CustomBagTag from "./components/bagtag/CustomBagTag";
import AdminPanel from "./components/adminpanel/Adminpanel";
import LocationComp from "./components/Location/location";
import TermsSection from "./TermsAndConditions";
import { apiEndPoint } from "./appConfig";
import AppLoader from "./AppComponents/AppLoader/AppLoader";
import AppToastProvider from "./AppComponents/AppToast/AppToastProvider";
import PendingOrder from "./components/PendingOrder";

function AppContent() {
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleht, setIsVisibleht] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [isVisiblecustomize, setIsVisiblecustomize] = useState(false);
  const [isvisiblecutout, setisvisiblecutout] = useState(true);
  const [ResellerLogin, setResellerLogin] = useState(false);
  const [ResellerProducts, setResellerProducts] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const [coupon, setcoupon] = useState("");

  const location = useLocation(); // This now works since it's inside Router
  const [visible, setVisible] = useState(false);

  const { data: healthData, isLoading: isHealthLoading } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await fetch(`${apiEndPoint}/health`);
      if (!res.ok) throw new Error("Health check failed");
      return res.json();
    },
    retry: true,
    refetchInterval: 20000,
    refetchIntervalInBackground: true,
  });

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
        <Suspense fallback={<div></div>}>
          {/* <SplashModal visible={visible} setVisible={setVisible} /> */}
          <PageLogger />
          <div className="flex flex-col gap-5 bg-white!">
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
            {isHealthLoading ? (
              <AppLoader />
            ) : (
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
                  path="/name-slip"
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
                  path="/cutout-name-slip"
                  element={
                    <CutOutNameSlip
                      searchText={searchText}
                      setSearchText={setSearchText}
                      setcoupon={setcoupon}
                    />
                  }
                />
                <Route
                  path="/cutout-name-slip/:id"
                  element={<ProductDetails />}
                />
                <Route
                  path="/CNtemplate1/:id"
                  element={<CutoutNameSlipPersonalize />}
                />
                {/* Birthday cap */}
                <Route path="/birthday-cap" element={<BirthdayCap />} />
                {/* custom name slips */}
                <Route path="/custom-name-slip" element={<CustomNameSlips />} />
                {/* bulk order */}
                <Route path="/bulk-order" element={<BulkOrder />} />
                {/* bag tag */}
                <Route path="/custom-bag-tag" element={<CustomBagTag />} />
                {/* background remover */}
                <Route path="/ai-bg-remover" element={<BackgroundRemover />} />
                {/* text behind image */}
                <Route
                  path="/text-behind-image"
                  element={<TextBehindImage />}
                />
                {/* bulk printing software */}
                <Route
                  path="/bulk-printing-software"
                  element={<BulkPrinting />}
                />
                {/* poster */}
                <Route path="/custom-poster" element={<Poster />} />
                {/* sticker */}
                <Route path="/custom-sticker" element={<CustomSticker />} />
                {/* dreamik glossy sticker */}
                <Route
                  path="/dreamik-glossy-sticker"
                  element={<LaserPrinting />}
                />
                {/* Cart Section */}
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
                {/* admin panel */}
                <Route path="/admin-panel" element={<AdminPanel />} />
                {/* payment page */}
                <Route path="/payment" element={<Payment />} />
                {/* full cash on delivery */}
                <Route
                  path="/full-cash-on-delivery"
                  element={<FullCashOnDelivery />}
                />
                {/* location comp */}
                <Route path="/location" element={<LocationComp />} />
                {/* terms and condition */}
                <Route path="/terms-and-condition" element={<TermsSection />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/pending-orders" element={<PendingOrder />} />
                <Route path="/my-order" element={<Myorder />} />
              </Routes>
            )}
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
    </HelmetProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="max-w-[1600px]! mx-auto! p-0! bg-white!">
          <AppToastProvider />
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
    </QueryClientProvider>
  );
}

export default App;
