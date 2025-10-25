import React, { useState } from "react";
import api from "../../api/api";
import { saveToken } from "../../utils/authUtils";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
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
      const res = await api.post("/auth/login", form);
      saveToken(res.data.token);
      setIsSuccess(true);
      setMessage("Đăng nhập thành công!");
      setTimeout(() => navigate("/products"), 1000);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-circle">
            <span className="logo-emoji">☕</span>
          </div>
          <h2 className="login-title">Đăng nhập</h2>
          <p className="login-subtitle">Chào mừng bạn quay trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              Tên đăng nhập hoặc Email
            </label>
            <input
              name="usernameOrEmail"
              placeholder="Nhập tên đăng nhập hoặc email"
              value={form.usernameOrEmail}
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
                Đang đăng nhập...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Đăng nhập
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">hoặc</span>
        </div>

        <p className="register-link">
          Chưa có tài khoản? 
          <Link to="/register" className="link-highlight">
            Đăng ký ngay
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