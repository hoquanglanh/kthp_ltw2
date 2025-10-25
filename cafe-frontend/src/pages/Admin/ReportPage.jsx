import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { getToken } from "../../utils/authUtils";
import "./ReportPage.css";

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/report/daily?date=${date}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setReport(res.data);
      setMessage("");
    } catch (err) {
      console.error("Lỗi tải báo cáo:", err);
      setMessage("Không thể tải báo cáo.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSearch = () => {
    fetchReport();
  };

  return (
    <div className="report-page">
      <div className="page-header">
        <h2 className="page-title">
          <span className="title-icon">📈</span>
          Báo cáo doanh thu & thống kê
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
          <button 
            onClick={handleSearch} 
            className="search-btn"
            disabled={loading}
          >
            <span className="btn-icon">🔍</span>
            {loading ? "Đang tải..." : "Xem báo cáo"}
          </button>
        </div>
      </div>

      {message && (
        <div className="message-alert">
          <span className="alert-icon">⚠️</span>
          {message}
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải báo cáo...</p>
        </div>
      )}

      {!loading && report && (
        <div className="report-container">
          <div className="report-header">
            <h3 className="report-date">
              <span className="calendar-icon">📅</span>
              Báo cáo ngày {new Date(report.date).toLocaleDateString("vi-VN")}
            </h3>
          </div>

          <div className="stats-grid">
            <div className="stat-card orders-card">
              <div className="stat-icon-wrapper orders-icon">
                <span className="stat-icon">☕</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Tổng số order</p>
                <p className="stat-value">{report.totalOrders}</p>
              </div>
              <div className="stat-decoration"></div>
            </div>

            <div className="stat-card customers-card">
              <div className="stat-icon-wrapper customers-icon">
                <span className="stat-icon">👥</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Số lượng khách</p>
                <p className="stat-value">{report.totalCustomers}</p>
              </div>
              <div className="stat-decoration"></div>
            </div>

            <div className="stat-card revenue-card">
              <div className="stat-icon-wrapper revenue-icon">
                <span className="stat-icon">💰</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Tổng doanh thu</p>
                <p className="stat-value revenue-value">
                  {report.totalRevenue.toLocaleString()} ₫
                </p>
              </div>
              <div className="stat-decoration"></div>
            </div>
          </div>

          <div className="summary-card">
            <h4 className="summary-title">
              <span className="summary-icon">📊</span>
              Tóm tắt nhanh
            </h4>
            <div className="summary-content">
              <div className="summary-item">
                <span className="summary-dot"></span>
                <p>Trung bình mỗi khách: <strong>{report.totalOrders > 0 ? Math.round(report.totalRevenue / report.totalOrders).toLocaleString() : 0} ₫</strong></p>
              </div>
              <div className="summary-item">
                <span className="summary-dot"></span>
                <p>Trung bình mỗi order: <strong>{report.totalCustomers > 0 ? (report.totalOrders / report.totalCustomers).toFixed(1) : 0}</strong> đơn</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !report && !message && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p className="empty-message">Chọn ngày để xem báo cáo</p>
        </div>
      )}
    </div>
  );
}