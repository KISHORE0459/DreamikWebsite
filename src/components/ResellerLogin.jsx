import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, CircularProgress } from "@mui/material";
import "../ResellerLogin.css";

function ResellerLogin({
  isOpen,
  onClose,
  setUsername,
  setUserid,
  setResellerLogin,
  setResellerProducts,
}) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedReseller = localStorage.getItem("loggedReseller");
    if (storedReseller) {
      setResellerLogin(JSON.parse(storedReseller));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("🔄 Logging in... Please wait!");

    try {
      const response = await fetch(
        "https://dreamik-intern.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: usernameInput, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Welcome, ${data.user.name}!`);
        setIsLoggedIn(true);
        setUsername(data.user.name);
        setUserid(data.user.id);
        setResellerProducts(data.user.products);
        setResellerLogin(true);

        setTimeout(onClose, 1000);

        // Local storage
        localStorage.setItem("ResellerLogin", true);
        localStorage.setItem("username", data.user.name);
        localStorage.setItem("resid", data.user.id);
        localStorage.setItem("ResellerProducts", data.user.products);
        localStorage.setItem("Rescoup", data.user.coupon);
        localStorage.setItem("address1", data.user.address1);
        localStorage.setItem("state", data.user.state);
        localStorage.setItem("offercount", data.user.offercount);
        localStorage.setItem("resellerform", JSON.stringify(data.user));

        window.location.reload();
      } else {
        setMessage("❌ Invalid Username or Password!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        className="
          bg-white rounded-xl shadow-lg! p-6! 
          w-[90%] sm:w-[400px] 
          absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          flex flex-col items-center gap-5
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 
            text-gray-600 hover:text-black 
            text-xl font-bold
          "
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-[#1b345f]">
          Reseller Login
        </h2>

        {/* Message */}
        {message && (
          <p className="text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}

        {!isLoggedIn ? (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-2"
          >
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={usernameInput}
              disabled={isLoading}
              onChange={(e) => setUsernameInput(e.target.value)}
            />

            {/* Password */}
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: "#1b345f",
                textTransform: "none",
                paddingY: "10px",
                fontSize: "16px",
                ":hover": { backgroundColor: "#162d52" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        ) : (
          <div className="w-full text-center mt-2">
            <h3 className="text-lg font-semibold text-green-600">
              You are now logged in! 🎉
            </h3>
          </div>
        )}
      </Box>
    </Modal>
  );
}

export default ResellerLogin;
