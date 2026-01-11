import { useState, useEffect } from "react";
import { apiEndPoint } from "../appConfig";
import toast from "react-hot-toast";

export const useAdminPanel = () => {
  const [adminData, setAdminData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserPassword, setSelectedUserPassword] = useState("");

  const [loginDetails, setLoginDetails] = useState({
    name: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    mobileno: "",
    whatsappno: "",
    address1: "",
    address2: "",
    pincode: "",
    district: "",
    state: "",
    landmark: "",
    products: [],
    walkin: "no",
    chekin: "no",
    courier: "no",
  });

  /* ---------------- FETCH ADMIN ---------------- */
  useEffect(() => {
    fetch("/admin.json")
      .then((res) => res.json())
      .then(setAdminData)
      .catch(console.error);
  }, []);

  /* ---------------- AUTH ---------------- */
  const handleLogin = (e) => {
    e.preventDefault();
    const admin = adminData.find(
      (u) =>
        u.name === loginDetails.name && u.password === loginDetails.password
    );
    admin ? setLoggedIn(true) : toast.error("Invalid username or password!");
  };

  /* ---------------- FORM ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleProductChange = (product) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  /* ---------------- ADD USER ---------------- */
  const handleAddUser = async () => {
    if (
      !formData.id ||
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Some inputs cannot be empty!");
      return;
    }

    const res = await fetch(`${apiEndPoint}/addReseller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    toast.success(data.message || "User added successfully!");
  };

  /* ---------------- FETCH USER ---------------- */
  const handleEditUser = async () => {
    if (!selectedUserName || !selectedUserPassword) {
      toast.error("Enter username & password");
      return;
    }

    const res = await fetch(`${apiEndPoint}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: selectedUserName,
        password: selectedUserPassword,
      }),
    });

    const data = await res.json();
    if (!data.success) return toast.error("User not found");

    setFormData({
      ...data.user,
      products: Array.isArray(data.user.products)
        ? data.user.products
        : JSON.parse(data.user.products || "[]"),
    });
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateUser = async () => {
    const res = await fetch(`${apiEndPoint}/updateReseller/${formData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert(data.message);
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteUser = async () => {
    if (!window.confirm("Delete this reseller?")) return;

    const res = await fetch(`${apiEndPoint}/deleteReseller/${formData.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);
  };

  return {
    /* state */
    loggedIn,
    loginDetails,
    formData,
    selectedUserName,
    selectedUserPassword,

    /* setters */
    setLoginDetails,
    setSelectedUserName,
    setSelectedUserPassword,

    /* handlers */
    handleLogin,
    handleChange,
    handleProductChange,
    handleAddUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
