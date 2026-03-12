import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Pages
import Login from './features/auth/pages/Login';

// Admin Pages
import Dashboard from './features/admin/pages/Dashboard';
import Orders from './features/admin/pages/Orders';
import OrderPOS from './features/admin/pages/OrderPOS';
import Customers from './features/admin/pages/Customers';
import Products from './features/admin/pages/Products';
import Reports from './features/admin/pages/Reports';
import Settings from './features/admin/pages/Settings';

// Layouts
import Layout from './components/layouts/Layout';
import CustomerLayout from './components/layouts/CustomerLayout';

// Customer Portal Pages
import Shop from './features/customer/pages/Shop';
import History from './features/customer/pages/History';

// Global Components
import GlobalConfirmModal from './components/common/GlobalConfirmModal';
import { Toaster } from 'sonner';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors theme="dark" />
      <GlobalConfirmModal />
      <Routes>
        {/* Public Routes - Chỉ được vào khi CHƯA đăng nhập */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected ADMIN Routes - Cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/pos" element={<OrderPOS />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Protected CUSTOMER Routes - Cần đăng nhập */}
        <Route path="/portal" element={<ProtectedRoute />}>
          <Route element={<CustomerLayout />}>
            <Route index element={<Shop />} />
            <Route path="shop" element={<Shop />} />
            <Route path="history" element={<History />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App
