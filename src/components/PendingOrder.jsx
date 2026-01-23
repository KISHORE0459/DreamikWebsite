import React, { useState, useContext } from "react";
import { CartContext } from "./CartContext";
import { apiEndPoint } from "../appConfig";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Container,
  Divider,
} from "@mui/material";
import { Search, ShoppingCart, Warning } from "@mui/icons-material";

const PendingOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [files, setFiles] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  const fetchFiles = async () => {
    if (!orderId) {
      toast.error("Please enter an Order ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiEndPoint}/retrieve/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setFiles(Array.isArray(data.files) ? data.files : []);
        const infoFile = data.files?.find((file) => file.name.endsWith(".txt"));
        if (infoFile) {
          setProductDetails(infoFile.content.productDetails || []);
        }
      } else {
        setError(data.error || "Failed to fetch files.");
      }
    } catch (err) {
      setError("An error occurred while fetching files.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCart = (product, imageData) => {
    const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];
    const productInCart = {
      image: imageData,
      quantity: product.quantity || 1,
      price: product.price,
      Name: product.Name,
      labeltype: product.labeltype,
      size: product.size,
    };
    existingCart.push(productInCart);
    localStorage.setItem("OrderData", JSON.stringify(existingCart));
    addToCart();
    toast.success(`${product.Name} added to cart!`);
  };

  return (
    <Container maxWidth="lg" className="py-5!">
      {/* Search Section */}
      <Box className="flex flex-col md:flex-row gap-4! justify-center items-center mb-10! p-6! bg-white rounded-xl shadow-sm border border-gray-100">
        <TextField
          label="Order ID"
          variant="outlined"
          size="small"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. ORD12345"
          className="w-full md:w-64"
        />
        <Button
          variant="contained"
          onClick={fetchFiles}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Search />
            )
          }
          className="h-10 px-6! bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Retrieving..." : "Retrieve Files"}
        </Button>
      </Box>

      {/* Error State */}
      {error && (
        <Box className="flex items-center justify-center gap-2 p-4! mb-6! bg-red-50 text-red-600 rounded-lg border border-red-100">
          <Warning fontSize="small" />
          <Typography variant="body2" className="font-medium">
            {error}
          </Typography>
        </Box>
      )}

      {/* Files Display */}
      {files.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            className="font-bold! mb-6! flex items-center gap-2!"
          >
            Order Items for <span className="text-blue-600">{orderId}</span>
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6!">
            {files.map((file, index) => {
              if (file.type === "image") {
                const product = productDetails[index];
                const imageSrc = `data:image/png;base64,${file.content}`;

                return (
                  <Card
                    key={file.name}
                    className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={imageSrc}
                      alt={file.name}
                      className="object-contain bg-gray-50 h-48 p-2!"
                    />
                    <CardContent className="flex-grow">
                      {product ? (
                        <Box>
                          <Typography
                            variant="subtitle1"
                            className="font-bold truncate"
                          >
                            {product.Name}
                          </Typography>
                          <Typography
                            variant="h6"
                            className="text-green-600 font-bold mb-2!"
                          >
                            ₹{product.price}
                          </Typography>

                          <Divider className="my-2!" />

                          <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600 mt-2!">
                            <span className="font-medium text-gray-400">
                              Size:
                            </span>
                            <span className="text-right">{product.size}</span>

                            <span className="font-medium text-gray-400">
                              Qty:
                            </span>
                            <span className="text-right">
                              {product.quantity}
                            </span>

                            <span className="font-medium text-gray-400">
                              Type:
                            </span>
                            <span className="text-right text-xs truncate pl-2!">
                              {product.labeltype}
                            </span>
                          </div>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="error"
                          className="italic"
                        >
                          Product metadata missing for this item.
                        </Typography>
                      )}
                    </CardContent>

                    <Box className="p-4! pt-0">
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCart />}
                        disabled={!product}
                        onClick={() => handleAddCart(product, imageSrc)}
                        className="rounded-lg py-2"
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        </Box>
      )}

      {/* Empty State */}
      {!loading && !files.length && !error && (
        <Box className="text-center py-20! text-gray-400">
          <Search sx={{ fontSize: 60, opacity: 0.2 }} />
          <Typography variant="h6">No orders retrieved yet</Typography>
          <Typography variant="body2">
            Enter an Order ID to fetch details and add items to your cart.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PendingOrder;
