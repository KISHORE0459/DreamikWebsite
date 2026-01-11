import React, { useEffect } from "react";
import axios from "axios";
import { useCouponContext } from "./CouponContext";
import { apiEndPoint } from "../../appConfig";

const AdminCouponTable = () => {
  const {
    coupons,
    setCoupons,
    setEditingId,
    editingId,
    editedCoupon,
    setEditedCoupon,
    loading,
    setLoading,
    addingNew,
    setAddingNew,
    newCoupon,
    setNewCoupon,
  } = useCouponContext();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiEndPoint}/api/coupons`);
      setCoupons(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCoupons([]);
    }
    setLoading(false);
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setEditedCoupon({ ...coupon });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedCoupon({});
  };

  const handleChange = (e, field, isNew = false) => {
    const value = e.target.value;
    if (isNew) {
      setNewCoupon({ ...newCoupon, [field]: value });
    } else {
      setEditedCoupon({ ...editedCoupon, [field]: value });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${apiEndPoint}/api/coupons/${editingId}`, editedCoupon);
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => setAddingNew(true);

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewCoupon({
      coupon_name: "",
      coupon_code: "",
      coupon_value: "",
      coupon_discount_mode: "0",
      coupon_start: "",
      coupon_end: "",
      coupon_count: "",
      coupon_usage_count: "",
      coupon_status: "Active",
      coupon_applicable_products: "",
    });
  };

  const handleSaveNew = async () => {
    try {
      await axios.post(`${apiEndPoint}/api/newcoupons`, newCoupon);
      setAddingNew(false);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  return (
    <div className="min-h-screen p-6!">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Coupons</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading Coupons...
          </div>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-purple-700 text-white text-sm uppercase">
              <tr>
                {[
                  "Name",
                  "Code",
                  "Value",
                  "Mode",
                  "Start",
                  "End",
                  "Count",
                  "Usage",
                  "Status",
                  "Products",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4! py-3! border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-sm">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition">
                    <td className="border px-3! py-2!">
                      {editingId === coupon.id ? (
                        <input
                          className="w-full border rounded px-2! py-1!"
                          value={editedCoupon.coupon_name}
                          onChange={(e) => handleChange(e, "coupon_name")}
                        />
                      ) : (
                        coupon.coupon_name
                      )}
                    </td>

                    <td className="border px-3! py-2! font-mono">
                      {coupon.coupon_code}
                    </td>

                    <td className="border px-3! py-2!">
                      {editingId === coupon.id ? (
                        <input
                          type="number"
                          className="w-full border rounded px-2! py-1!"
                          value={editedCoupon.coupon_value}
                          onChange={(e) => handleChange(e, "coupon_value")}
                        />
                      ) : (
                        `₹${coupon.coupon_value}`
                      )}
                    </td>

                    <td className="border px-3! py-2!">
                      {editingId === coupon.id ? (
                        <select
                          className="w-full border rounded px-2! py-1!"
                          value={editedCoupon.coupon_discount_mode}
                          onChange={(e) =>
                            handleChange(e, "coupon_discount_mode")
                          }
                        >
                          <option value="true">Percent</option>
                          <option value="false">Rupees</option>
                        </select>
                      ) : coupon.coupon_discount_mode ? (
                        "%"
                      ) : (
                        "₹"
                      )}
                    </td>

                    <td className="border px-3! py-2!">
                      {formatDate(coupon.coupon_start)}
                    </td>
                    <td className="border px-3! py-2!">
                      {formatDate(coupon.coupon_end)}
                    </td>
                    <td className="border px-3! py-2!">
                      {coupon.coupon_count}
                    </td>
                    <td className="border px-3! py-2!">
                      {coupon.coupon_usage_count}
                    </td>
                    <td className="border px-3! py-2!">
                      {coupon.coupon_status}
                    </td>

                    <td className="border px-3! py-2! max-w-[140px] truncate">
                      {editingId === coupon.id ? (
                        <input
                          className="w-full border rounded px-2! py-1!"
                          value={editedCoupon.coupon_applicable_products}
                          onChange={(e) =>
                            handleChange(e, "coupon_applicable_products")
                          }
                        />
                      ) : (
                        coupon.coupon_applicable_products
                      )}
                    </td>

                    <td className="border px-3! py-2!">
                      {editingId === coupon.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-3! py-1! rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-600 text-white px-3! py-1! rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="bg-purple-600 text-white px-3! py-1! rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-6! text-gray-500">
                    No coupons available
                  </td>
                </tr>
              )}

              {/* ADD NEW ROW */}
              {addingNew && (
                <tr className="bg-gray-50">
                  {["coupon_name", "coupon_code", "coupon_value"].map((f) => (
                    <td key={f} className="border px-3! py-2!">
                      <input
                        className="w-full border rounded px-2! py-1!"
                        value={newCoupon[f]}
                        onChange={(e) => handleChange(e, f, true)}
                      />
                    </td>
                  ))}

                  <td className="border px-3! py-2!">
                    <select
                      className="w-full border rounded px-2! py-1!"
                      value={newCoupon.coupon_discount_mode}
                      onChange={(e) =>
                        handleChange(e, "coupon_discount_mode", true)
                      }
                    >
                      <option value="1">Percent</option>
                      <option value="0">Rupees</option>
                    </select>
                  </td>

                  {[
                    "coupon_start",
                    "coupon_end",
                    "coupon_count",
                    "coupon_usage_count",
                  ].map((f) => (
                    <td key={f} className="border px-3! py-2!">
                      <input
                        type={f.includes("date") ? "date" : "number"}
                        className="w-full border rounded px-2! py-1!"
                        value={newCoupon[f]}
                        onChange={(e) => handleChange(e, f, true)}
                      />
                    </td>
                  ))}

                  <td className="border px-3! py-2!">
                    <select
                      className="w-full border rounded px-2! py-1!"
                      value={newCoupon.coupon_status}
                      onChange={(e) => handleChange(e, "coupon_status", true)}
                    >
                      <option>Active</option>
                      <option>Expired</option>
                    </select>
                  </td>

                  <td className="border px-3! py-2!">
                    <input
                      className="w-full border rounded px-2! py-1!"
                      value={newCoupon.coupon_applicable_products}
                      onChange={(e) =>
                        handleChange(e, "coupon_applicable_products", true)
                      }
                    />
                  </td>

                  <td className="border px-3! py-2!">
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNew}
                        className="bg-green-600! text-white px-3! py-1! rounded hover:cursor-pointer!"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelAdd}
                        className="bg-red-600! text-white px-3! py-1! rounded hover:cursor-pointer!"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {!addingNew && (
        <div className="mt-6! text-center">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-6! py-2! rounded shadow hover:cursor-pointer!"
          >
            Add Coupon
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCouponTable;
