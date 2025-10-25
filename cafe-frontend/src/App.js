import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ProductList from "./pages/Product/ProductList";
import TableList from "./pages/Table/TableList";
import OrderPage from "./pages/Order/OrderPage";
import ReportPage from "./pages/Admin/ReportPage";
import AdminOrderPage from "./pages/Admin/AdminOrderPage";

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/tables" element={<TableList />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/orders" element={<AdminOrderPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;