import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PublicRoute = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        // Nếu đã đăng nhập, không cho vào trang Login nữa, chuyển thẳng vào Dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
