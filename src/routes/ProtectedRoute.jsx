import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const hasRole = allowedRoles.some(role => user?.roles?.includes(role));
        if (!hasRole) {
            // Nếu không có quyền (ví dụ: nhân viên vào trang admin), chuyển về dashboard hoặc trang báo lỗi
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
