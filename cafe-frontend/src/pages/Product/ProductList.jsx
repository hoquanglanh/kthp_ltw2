import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { getToken, isAdmin } from "../../utils/authUtils";
import ProductForm from "./ProductForm";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async (category = "") => {
    setLoading(true);
    try {
      const res = await api.get(
        category ? `/products?category=${category}` : "/products",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        fetchProducts(selectedCategory);
      } catch (err) {
        console.error("Lỗi xóa sản phẩm:", err);
        alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
      }
    }
  };

  const handleProductClick = (product) => {
    if (!isAdmin()) {
      navigate("/order", { state: { preselectedProduct: product } });
    }
  };

  return (
    <div className="product-list-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">
            <span className="title-icon">☕</span> Danh sách sản phẩm
          </h2>

          {/* ✅ Bộ lọc category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">Tất cả</option>
            <option value="Cà phê">Cà phê</option>
            <option value="Sinh tố">Sinh tố</option>
            <option value="Trà sữa">Trà sữa</option>
            <option value="Nước ép">Nước ép</option>
            <option value="Trà trái cây">Trà trái cây</option>
            <option value="Nước giải khát">Nước giải khát</option>
          </select>

          {isAdmin() && (
            <button
              onClick={() => {
                setEditProduct(null);
                setShowForm(true);
              }}
              className="add-btn"
            >
              <span className="btn-icon">➕</span> Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      {isAdmin() && showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => setShowForm(false)}
          onSaved={() => fetchProducts(selectedCategory)}
        />
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Giá</th>
                <th>Mô tả</th>
                {isAdmin() && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`product-row ${!isAdmin() ? "clickable" : ""}`}
                  onClick={() => handleProductClick(p)}
                  style={{
                    cursor: !isAdmin() ? "pointer" : "default",
                  }}
                >
                  <td className="product-image-cell">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="product-image"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="no-image">📷</div>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category || "—"}</td>
                  <td>{p.price.toLocaleString()} ₫</td>
                  <td>{p.description || "—"}</td>
                  {isAdmin() && (
                    <td className="actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditProduct(p);
                          setShowForm(true);
                        }}
                        className="edit-btn"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="delete-btn"
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>Không có sản phẩm nào.</p>
        </div>
      )}
    </div>
  );
}
