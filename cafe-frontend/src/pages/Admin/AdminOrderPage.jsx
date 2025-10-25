import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { getToken, isAdmin } from "../../utils/authUtils";
import "./AdminOrderPage.css";

export default function AdminOrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAdmin()) {
      setMessage("Bạn không có quyền truy cập trang quản lý đơn hàng. Vui lòng đăng nhập với tài khoản ADMIN.");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders?date=${date}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
        setMessage("Dữ liệu từ server không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi tải danh sách đơn hàng:", err);
      if (err.response?.status === 403) {
        setMessage("Bạn không có quyền truy cập danh sách đơn hàng.");
      } else {
        setMessage("Không thể tải danh sách đơn hàng.");
      }
      setOrders([]);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSearch = () => {
    if (!isAdmin()) {
      setMessage("Bạn không có quyền truy cập trang quản lý đơn hàng.");
      return;
    }
    fetchOrders();
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setMessage("Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  if (!isAdmin()) {
    return (
      <div className="error-container">
        <div className="error-icon">🚫</div>
        <p className="error-message">{message}</p>
      </div>
    );
  }

  return (
    <div className="admin-order-page">
      <div className="page-header">
        <h2 className="page-title">
          <span className="title-icon">📊</span>
          Quản lý đơn hàng
        </h2>
        <div className="date-filter">
          <label className="filter-label">
            <span className="label-icon">📅</span>
            Chọn ngày:
          </label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="date-input"
          />
          <button onClick={handleSearch} className="search-btn">
            <span className="btn-icon">🔍</span>
            Xem đơn hàng
          </button>
        </div>
      </div>

      {message && (
        <div className="message-alert">
          <span className="alert-icon">⚠️</span>
          {message}
        </div>
      )}

      {orders.length > 0 ? (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Thời gian</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                (order.items || []).map((item, index) => (
                  <tr key={`${order.id}-${index}`} className="order-row">
                    <td className="order-id">#{order.id}</td>
                    <td className="order-time">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="customer-id">{order.userId || "N/A"}</td>
                    <td className="product-name">
                      <span className="product-icon">☕</span>
                      {item.productName || "Không xác định"}
                    </td>
                    <td className="quantity">
                      <span className="quantity-badge">x{item.quantity || 0}</span>
                    </td>
                    <td className="price">{(item.price || 0).toLocaleString()} ₫</td>
                    <td className="total-price">
                      <strong>{(order.totalPrice || 0).toLocaleString()} ₫</strong>
                    </td>
                    <td className="status">
                      <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                        {order.status || "N/A"}
                      </span>
                    </td>
                    <td className="actions">
                      {isAdmin() && (
                        <select
                          value={order.status || "PENDING"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p className="empty-message">Không có đơn hàng nào trong ngày này.</p>
        </div>
      )}
    </div>
  );
}