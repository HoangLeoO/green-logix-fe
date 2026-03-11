import { useState } from 'react'
import { Rocket } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// Admin Pages
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderPOS from './pages/OrderPOS';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Layout from './components/Layout';

// Customer Portal Pages
import CustomerLayout from './components/CustomerLayout';
import Shop from './pages/customer/Shop';
import History from './pages/customer/History';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected ADMIN Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pos" element={<OrderPOS />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Protected CUSTOMER Routes inside CustomerLayout */}
        <Route path="/portal" element={<CustomerLayout />}>
          <Route index element={<Shop />} />
          <Route path="shop" element={<Shop />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
