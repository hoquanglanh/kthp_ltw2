import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { getToken } from "../../utils/authUtils";

export default function TableForm({ table, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    status: "AVAILABLE",
    capacity: 0,
  });
  const [error, setError] = useState(null);

  // Cập nhật lại form khi prop `table` thay đổi
  useEffect(() => {
    if (table) {
      setForm({
        name: table.name || "",
        status: table.status || "AVAILABLE",
        capacity: table.capacity || 0,
      });
    } else {
      // reset form khi thêm mới
      setForm({
        name: "",
        status: "AVAILABLE",
        capacity: 0,
      });
    }
  }, [table]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (table) {
        await api.put(`/tables/${table.id}`, form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      } else {
        await api.post("/tables", form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      }
      setError(null);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Lỗi lưu bàn:", err);
      if (err.response?.status === 403) {
        setError("Bạn không có quyền thêm hoặc sửa bàn!");
      } else {
        setError("Lỗi lưu bàn. Vui lòng thử lại.");
      }
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
      <h3>{table ? "Sửa thông tin bàn" : "Thêm bàn mới"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên bàn (VD: Bàn 1)"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <input
          name="capacity"
          type="number"
          placeholder="Số người tối đa"
          value={form.capacity}
          onChange={handleChange}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        >
          <option value="AVAILABLE">Trống</option>
          <option value="OCCUPIED">Đang có khách</option>
          <option value="PAID">Đã thanh toán</option>
        </select>

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
