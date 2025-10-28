import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { getToken, isAdmin } from "../../utils/authUtils";
import TableForm from "./TableForm";
import "./TableList.css";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tables", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTables(res.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi tải danh sách bàn:", err);
      setError("Lỗi tải danh sách bàn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bàn này?")) {
      try {
        await api.delete(`/tables/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        fetchTables();
      } catch (err) {
        console.error("Lỗi xóa bàn:", err);
        if (err.response?.status === 403) {
          alert("Bạn không có quyền xóa bàn!");
        } else {
          alert("Không thể xóa bàn. Vui lòng thử lại!");
        }
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const currentTable = tables.find((t) => t.id === id);
      if (!currentTable) throw new Error("Không tìm thấy bàn");

      await api.put(
        `/tables/${id}`,
        { ...currentTable, status },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchTables();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái bàn:", err);
      if (err.response?.status === 403) {
        alert("Bạn không có quyền cập nhật trạng thái bàn!");
      } else {
        alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
      }
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "AVAILABLE":
        return { text: "Trống", class: "available" };
      case "OCCUPIED":
        return { text: "Đang có khách", class: "occupied" };
      case "PAID":
        return { text: "Đã thanh toán", class: "paid" };
      default:
        return { text: "N/A", class: "" };
    }
  };

  const handleTableClick = (table) => {
    if (!isAdmin() && table.status === "AVAILABLE") {
      navigate("/order", { state: { preselectedTable: table } });
    }
  };

  return (
    <div className="table-list-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">
            <span className="title-icon">🪑</span>
            Quản lý bàn
          </h2>
          {isAdmin() && (
            <button
              onClick={() => {
                setEditTable(null);
                setShowForm(true);
              }}
              className="add-btn"
            >
              <span className="btn-icon">➕</span>
              Thêm bàn mới
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {isAdmin() && showForm && (
        <TableForm
          table={editTable}
          onClose={() => setShowForm(false)}
          onSaved={fetchTables}
        />
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải danh sách bàn...</p>
        </div>
      ) : tables.length > 0 ? (
        <div className="table-container">
          <table className="tables-table">
            <thead>
              <tr>
                <th>Tên bàn</th>
                <th>Số người tối đa</th>
                <th>Trạng thái</th>
                {isAdmin() && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => {
                const statusInfo = getStatusInfo(t.status);
                const clickable =
                  !isAdmin() && t.status === "AVAILABLE" ? "clickable" : "";
                return (
                  <tr
                    key={t.id}
                    className={`table-row status-${statusInfo.class} ${clickable}`}
                    onClick={() => handleTableClick(t)}
                    style={{
                      cursor:
                        !isAdmin() && t.status === "AVAILABLE"
                          ? "pointer"
                          : "default",
                    }}
                  >
                    <td className="table-name">
                      <span className="table-icon">🪑</span>
                      {t.name}
                    </td>
                    <td className="table-capacity">
                      <span className="capacity-badge">
                        <span className="capacity-icon">👥</span>
                        {t.capacity}
                      </span>
                    </td>
                    <td className="table-status">
                      <span className={`status-badge status-${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    {isAdmin() && (
                      <td className="actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); //ngăn click vào row
                            setEditTable(t);
                            setShowForm(true);
                          }}
                          className="edit-btn"
                        >
                          <span className="btn-icon">✏️</span>
                          Sửa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id);
                          }}
                          className="delete-btn"
                        >
                          <span className="btn-icon">🗑️</span>
                          Xóa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            let newStatus;
                            if (t.status === "AVAILABLE") newStatus = "OCCUPIED";
                            else if (t.status === "OCCUPIED") newStatus = "PAID";
                            else newStatus = "AVAILABLE";

                            handleUpdateStatus(t.id, newStatus);
                          }}
                          className="toggle-btn"
                        >
                          <span className="btn-icon">🔁</span>
                          Đổi trạng thái
                        </button>

                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🪑</div>
          <p className="empty-message">Chưa có bàn nào</p>
          {isAdmin() && (
            <button
              onClick={() => {
                setEditTable(null);
                setShowForm(true);
              }}
              className="add-btn-empty"
            >
              <span className="btn-icon">➕</span>
              Thêm bàn đầu tiên
            </button>
          )}
        </div>
      )}
    </div>
  );
}
