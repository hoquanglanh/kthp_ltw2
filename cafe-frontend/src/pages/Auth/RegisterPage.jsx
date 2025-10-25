import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await api.post("/auth/register", form);
      setIsSuccess(true);
      setMessage("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data || "Lỗi đăng ký. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo-circle">
            <span className="logo-emoji">☕</span>
          </div>
          <h2 className="register-title">Đăng ký tài khoản</h2>
          <p className="register-subtitle">Tham gia cùng chúng tôi ngay hôm nay!</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              Tên đăng nhập
            </label>
            <input
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📧</span>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="btn-icon">✨</span>
                Đăng ký ngay
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">hoặc</span>
        </div>

        <p className="login-link">
          Đã có tài khoản? 
          <Link to="/" className="link-highlight">
            Đăng nhập
          </Link>
        </p>

        {message && (
          <div className={`message-box ${isSuccess ? 'success' : 'error'}`}>
            <span className="message-icon">
              {isSuccess ? '✅' : '⚠️'}
            </span>
            {message}
          </div>
        )}
      </div>

      <div className="decoration-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
}