import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import { getToken, isAdmin } from "../../utils/authUtils";
import "./OrderPage.css";

export default function OrderPage() {
  const location = useLocation();

  const preselectedProduct = location.state?.preselectedProduct;
  const preselectedTable = location.state?.preselectedTable;

  const [availableTables, setAvailableTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách bàn trống
  const fetchAvailableTables = async () => {
  try {
    const res = await api.get("/tables", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    // Chỉ hiển thị bàn chưa thanh toán (tránh bàn PAID)
    const usableTables = res.data.filter(
      (t) => t.status === "AVAILABLE" || t.status === "OCCUPIED"
    );

    setAvailableTables(usableTables);

    // Nếu có bàn được truyền từ TableList
    if (preselectedTable) {
      setSelectedTable(preselectedTable.id);
    }
  } catch (err) {
    console.error("Lỗi tải bàn:", err);
  }
};


  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);

      // Nếu có món được chọn sẵn từ ProductList
      if (preselectedProduct) {
        setSelectedProducts([preselectedProduct.id]);
      }
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchAvailableTables();
    fetchProducts();
  }, []);

  // Chọn / Bỏ chọn món
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Tính tổng tiền
  const getTotalPrice = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find((p) => p.id === productId);
      return total + (product?.price || 0);
    }, 0);
  };

  // Xử lý đặt bàn / thêm món
  const handleOrder = async () => {
    if (!selectedTable) {
      setMessage("⚠️ Vui lòng chọn bàn!");
      setMessageType("warning");
      return;
    }
    if (selectedProducts.length === 0) {
      setMessage("⚠️ Vui lòng chọn ít nhất một món!");
      setMessageType("warning");
      return;
    }

    const selectedTableInfo = availableTables.find(
      (t) => t.id === selectedTable
    );

    setIsLoading(true);
    try {
      if (selectedTableInfo?.status === "OCCUPIED") {
        // Nếu bàn đang có khách → thêm món vào đơn hiện tại
        await api.post(
          "/orders/add-items",
          {
            tableId: selectedTable,
            productIds: selectedProducts,
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setMessage("✅ Đã thêm món vào đơn hiện tại!");
        setMessageType("success");
        setSelectedProducts([]);
      } else {
        // Nếu bàn còn trống → tạo đơn mới
        await api.post(
          "/orders",
          {
            tableId: selectedTable,
            productIds: selectedProducts,
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setMessage("✅ Đặt bàn thành công!");
        setMessageType("success");
        setSelectedTable("");
        setSelectedProducts([]);
        fetchAvailableTables();
      }
    } catch (err) {
      console.error("Lỗi đặt bàn:", err);
      setMessage("❌ Lỗi xử lý đơn hàng. Vui lòng thử lại!");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Ngăn admin truy cập trang đặt bàn
  if (isAdmin()) {
    return (
      <div className="error-container">
        <div className="error-icon">🚫</div>
        <p className="error-message">
          Trang này chỉ dành cho khách hàng, không phải ADMIN.
        </p>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="page-header">
        <h2 className="page-title">
          <span className="title-icon">🍽️</span>
          Đặt bàn và gọi món
        </h2>
      </div>

      <div className="order-content">
        {/* ------------------ Chọn bàn ------------------ */}
        <div className="section-card">
          <h3 className="section-title">
            <span className="section-icon">🪑</span> Chọn bàn
          </h3>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="table-select"
            disabled={isLoading}
          >
            <option value="">-- Chọn bàn --</option>
            {availableTables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.status === "AVAILABLE" ? "Trống" : "Đang có khách"})
              </option>
            ))}
          </select>
          {availableTables.length === 0 && (
            <p className="no-tables">
              Không có bàn trống. Vui lòng quay lại sau!
            </p>
          )}
        </div>

        {/* ------------------ Chọn món ------------------ */}
        <div className="section-card">
          <h3 className="section-title">
            <span className="section-icon">☕</span> Chọn món (
            {selectedProducts.length} món đã chọn)
          </h3>
          <div className="products-grid">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p.id)}
                className={`product-card ${
                  selectedProducts.includes(p.id) ? "selected" : ""
                }`}
              >
                <div className="product-check">
                  {selectedProducts.includes(p.id) && (
                    <span className="check-icon">✓</span>
                  )}
                </div>
                <div className="product-icon">☕</div>
                <h4 className="product-name">{p.name}</h4>
                <p className="product-price">
                  {p.price.toLocaleString()}₫
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------ Tóm tắt đơn hàng ------------------ */}
        {selectedProducts.length > 0 && (
          <div className="summary-card">
            <h3 className="summary-title">
              <span className="summary-icon">📋</span> Tóm tắt đơn hàng
            </h3>
            <div className="summary-content">
              {selectedProducts.map((productId) => {
                const product = products.find((p) => p.id === productId);
                if (!product) return null;
                return (
                  <div key={productId} className="summary-item">
                    <span>☕ {product.name}</span>
                    <strong>{product.price.toLocaleString()}₫</strong>
                  </div>
                );
              })}

              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <strong className="total-price">
                  {getTotalPrice().toLocaleString()}₫
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ------------------ Nút xác nhận ------------------ */}
        <button
          onClick={handleOrder}
          className={`order-btn ${isLoading ? "loading" : ""}`}
          disabled={isLoading || !selectedTable || selectedProducts.length === 0}
        >
          {isLoading ? (
            <>
              <span className="spinner-small"></span> Đang xử lý...
            </>
          ) : (
            <>
              <span className="btn-icon">✅</span> Xác nhận đặt bàn / thêm món
            </>
          )}
        </button>

        {/* ------------------ Thông báo ------------------ */}
        {message && (
          <div className={`message-box ${messageType}`}>
            <span className="message-icon">
              {messageType === "success" && "✅"}
              {messageType === "warning" && "⚠️"}
              {messageType === "error" && "❌"}
            </span>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
