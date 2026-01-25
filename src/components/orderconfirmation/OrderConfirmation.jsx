import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words";
import {
  Button,
  Typography,
  Container,
  Paper,
  Divider,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  WhatsApp,
  PictureAsPdf,
  Home,
  CardGiftcard,
} from "@mui/icons-material";
import { apiEndPoint } from "../../appConfig";

// Move static data outside to prevent re-renders
const STATE_CODES = {
  "JAMMU AND KASHMIR": "01",
  "HIMACHAL PRADESH": "02",
  PUNJAB: "03",
  CHANDIGARH: "04",
  UTTARAKHAND: "05",
  HARYANA: "06",
  DELHI: "07",
  RAJASTHAN: "08",
  "UTTAR PRADESH": "09",
  BIHAR: "10",
  SIKKIM: "11",
  "ARUNACHAL PRADESH": "12",
  NAGALAND: "13",
  MANIPUR: "14",
  MIZORAM: "15",
  TRIPURA: "16",
  MEGHALAYA: "17",
  ASSAM: "18",
  "WEST BENGAL": "19",
  JHARKHAND: "20",
  ODISHA: "21",
  CHATTISGARH: "22",
  "MADHYA PRADESH": "23",
  GUJARAT: "24",
  MAHARASHTRA: "27",
  KARNATAKA: "29",
  GOA: "30",
  LAKSHADWEEP: "31",
  KERALA: "32",
  "TAMIL NADU": "33",
  PUDUCHERRY: "34",
  "ANDAMAN AND NICOBAR ISLANDS": "35",
  TELANGANA: "36",
  "ANDHRA PRADESH (NEWLY ADDED)": "37",
  "LADAKH (NEWLY ADDED)": "38",
};

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const instant = sessionStorage.getItem("Instant");
  const pdfRef = useRef();

  const [orderData, setOrderData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [formContainer, setFormContainer] = useState({});
  const [priceDetails, setPriceDetails] = useState({});
  const [orderId, setOrderId] = useState("");
  const [OrderId2, setOrderId2] = useState("");
  const { setCartCount } = useContext(CartContext);
  const [isLoading, setLoading] = useState(false);

  // Helper: Load Image
  const loadImageAsBase64 = (path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject("Image failed to load");
      img.src = path;
    });
  };

  // Optimized PDF Generation
  const generatePDF = useCallback(
    async (shouldDownload = false) => {
      if (!orderId) return;

      const doc = new jsPDF();
      const marginLeft = 15;
      const marginTop = 15;
      const pageWidth = doc.internal.pageSize.width;
      const rightMargin = pageWidth / 2 + 10;

      try {
        const logoBase64 = await loadImageAsBase64("/image/logo.png");
        doc.addImage(logoBase64, "PNG", marginLeft, marginTop, 25, 25);
      } catch (e) {
        console.warn("Logo failed to load");
      }

      doc
        .setFontSize(16)
        .setFont("helvetica", "bold")
        .text("INVOICE", pageWidth / 2, marginTop + 20, { align: "center" });

      // Left Header
      doc.setFontSize(18).text("Dreamik AI", marginLeft, marginTop + 40);
      doc
        .setFontSize(10)
        .setFont("helvetica", "normal")
        .text(
          [
            "Dream it, get it from us...",
            "Phone: +91-044-28505188",
            "Email: dreamikai@gmail.com",
          ],
          marginLeft,
          marginTop + 45,
        );

      // Right Header
      doc
        .setFontSize(11)
        .setFont("helvetica", "bold")
        .text(
          "MURVEN INFOTECH DESIGN SOLUTIONS LLP",
          rightMargin,
          marginTop + 40,
        );
      doc
        .setFontSize(9)
        .setFont("helvetica", "normal")
        .text(
          ["715-A, Spencer Plaza", "Chennai - 600 002", "GST: 33ABPFM6846A1Z8"],
          rightMargin,
          marginTop + 45,
        );

      // Table
      autoTable(doc, {
        startY: marginTop + 145,
        head: [["No", "Description", "Price", "Qty", "Tax", "Total"]],
        body: orderData.map((item, i) => [
          i + 1,
          item.Name,
          `Rs. ${Math.round(item.price * 0.82)}`,
          item.quantity,
          "18%",
          `Rs. ${item.price * item.quantity}`,
        ]),
        theme: "grid",
        styles: { fontSize: 8 },
      });

      const pdfBlob = doc.output("blob");
      if (shouldDownload) {
        doc.save(`Invoice_${orderId}.pdf`);
      } else {
        const formData = new FormData();
        formData.append("invoice", pdfBlob, `Invoice_${orderId}.pdf`);
        formData.append("orderId", orderId);
        fetch(`${apiEndPoint}/upload`, {
          method: "POST",
          body: formData,
        }).catch(console.error);
      }
    },
    [orderId, orderData, priceDetails],
  );

  // Initial Data Load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("OrderConfirmationData"));
    if (stored) {
      setOrderData(stored.orderData);
      setPaymentDetails(stored.paymentDetails);
      setFormContainer(stored.formContainer);
      setPriceDetails(stored.priceDetails);
      setOrderId(stored.orderId);
      setOrderId2(stored.OrderId2);
      setCartCount(0);

      // Send Logs Logic
      const logs = JSON.parse(sessionStorage.getItem("userLogs"));
      if (logs) {
        fetch(`${apiEndPoint}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logs),
        })
          .then(() => sessionStorage.removeItem("userLogs"))
          .catch(console.error);
      }
    } else {
      // navigate("/payment");
    }
  }, [navigate, setCartCount]);

  // Auto-generate PDF on load
  useEffect(() => {
    if (orderId) generatePDF(false);
  }, [orderId, generatePDF]);

  const handleBackToHome = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleSendWhatsapp = () => {
    const phone = prompt("Enter WhatsApp number (with country code):");
    if (phone) {
      const msg = encodeURIComponent(
        `Invoice: ${orderId}, Total: ${priceDetails.totalPrice}`,
      );
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    }
  };

  return (
    <div className="py-5!">
      <Paper elevation={3} className="p-2! md:p-6! bg-white rounded-xl">
        {isLoading && <LinearProgress className="mb-4!" />}

        <Box className="flex flex-col items-center text-center mb-8!">
          <CheckCircle sx={{ fontSize: 60, color: "green" }} />
          <Typography variant="h4" className="font-bold mt-4!">
            Order Confirmed!
          </Typography>
          <Typography color="textSecondary">
            Thank you for your purchase. Your order is being processed.
          </Typography>
        </Box>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8! mb-8!"
          ref={pdfRef}
        >
          <Box className="bg-gray-50 p-4! rounded-lg">
            <Typography
              variant="h6"
              className="font-bold! border-b! pb-2! mb-3!"
            >
              Order Summary
            </Typography>
            <List dense>
              {orderData.map((item, idx) => (
                <ListItem key={idx} className="px-0">
                  <ListItemText
                    primary={`${item.Name} (x${item.quantity})`}
                    secondary={`Size: ${item.size} | Type: ${item.labeltype}`}
                  />
                  <Typography variant="body2" className="font-medium">
                    Rs. {item.price * item.quantity}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider className="my-2" />
            <Box className="flex justify-between items-center mt-2!">
              <Typography variant="subtitle1" className="font-bold">
                Total Payable:
              </Typography>
              <Typography variant="h6" color="primary" className="font-bold">
                Rs. {priceDetails.totalPrice}
              </Typography>
            </Box>
          </Box>

          <Box className="bg-gray-50 p-4! rounded-lg">
            <Typography
              variant="h6"
              className="font-bold! border-b! pb-2! mb-3!"
            >
              Delivery Details
            </Typography>
            <Typography variant="body2" className="mb-1!">
              <strong>{formContainer.name}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formContainer.address1}, {formContainer.district}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formContainer.state} - {formContainer.pincode}
            </Typography>
            <Typography variant="body2" className="mt-2!">
              Phone: {formContainer.phone}
            </Typography>
          </Box>
        </div>

        {/* Action Buttons */}
        <Box className="flex flex-wrap gap-4 mt-8! justify-center">
          <Button
            variant="contained"
            color="warning"
            startIcon={<PictureAsPdf />}
            onClick={() => generatePDF(true)}
            className="capitalize"
          >
            Download Invoice
          </Button>

          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsApp />}
            onClick={handleSendWhatsapp}
          >
            Send to WhatsApp
          </Button>

          {instant === "instant" && (
            <Button variant="contained" color="secondary" onClick={() => {}}>
              Instant PDF (6x2)
            </Button>
          )}
        </Box>

        <div className="mt-10! p-4! bg-blue-50 border-blue-200 flex items-start gap-4!">
          <div className="w-full! flex flex-col items-center justify-center">
            <div className="flex items-center gap-2!">
              <CardGiftcard color="primary" />
              <Typography variant="subtitle2" className="font-bold">
                Claim Your Free Gift!
              </Typography>
            </div>
            <Typography variant="body2">
              Get a free 6x4 inch photo print. Send your Order ID ({OrderId2})
              to our{" "}
              <a
                href="https://wa.me/919498088659"
                target="_blank"
                className="text-blue-600 underline ml-1"
              >
                WhatsApp
              </a>
              .
            </Typography>
          </div>
        </div>

        <Box className="mt-10! text-center">
          <Button
            variant="text"
            startIcon={<Home />}
            onClick={handleBackToHome}
            size="large"
          >
            Return to Homepage
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default OrderConfirmation;
