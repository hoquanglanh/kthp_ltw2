import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken, isAdmin } from "../utils/authUtils";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const token = getToken();
  const admin = isAdmin();

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">☕</div>
          <h2 className="logo-text">Cafe Management</h2>
        </div>

        <nav className="nav-section">
          <Link to="/products" className="nav-link">
            <span className="nav-icon">📋</span>
            Menu
          </Link>
          
          <Link to="/tables" className="nav-link">
            <span className="nav-icon">🪑</span>
            Bàn
          </Link>
          
          {!admin && (
            <Link to="/order" className="nav-link">
              <span className="nav-icon">🛒</span>
              Đặt món
            </Link>
          )}
          
          {admin && (
            <Link to="/orders" className="nav-link">
              <span className="nav-icon">📊</span>
              Quản lý Order
            </Link>
          )}
          
          {admin && (
            <Link to="/report" className="nav-link">
              <span className="nav-icon">📈</span>
              Báo cáo
            </Link>
          )}

          <div className="auth-divider"></div>
          
          {token ? (
            <button onClick={handleLogout} className="btn btn-logout">
              <span className="btn-icon">🚪</span>
              Đăng xuất
            </button>
          ) : (
            <Link to="/" className="btn btn-login">
              <span className="btn-icon">🔑</span>
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}