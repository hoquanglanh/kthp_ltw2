import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { getToken } from "../../utils/authUtils";

export default function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  // Cập nhật form khi product thay đổi
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    } else {
      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await api.put(`/products/${product.id}`, form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      } else {
        await api.post("/products", form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Lỗi lưu sản phẩm:", err);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "6px",
        marginBottom: "10px",
      }}
    >
      <h3>{product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        {/* ✅ Thêm select category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        >
          <option value="">-- Chọn loại sản phẩm --</option>
          <option value="Cà phê">☕ Cà phê</option>
          <option value="Sinh tố">🍹 Sinh tố</option>
          <option value="Trà sữa">🧋 Trà sữa</option>
          <option value="Nước ép">🥤 Nước ép</option>
          <option value="Trà trái cây">🧃 Trà trái cây</option>
          <option value="Nước giải khát">🍾 Nước giải khát</option>
        </select>

        <input
          name="price"
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <input
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <input
          name="imageUrl"
          placeholder="Link hình ảnh sản phẩm (https://...)"
          value={form.imageUrl}
          onChange={handleChange}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        {form.imageUrl && (
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            background: "#6f4e37",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "8px",
          }}
        >
          💾 Lưu
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "#ccc",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ❌ Hủy
        </button>
      </form>
    </div>
  );
}
