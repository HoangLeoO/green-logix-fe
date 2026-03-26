import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { orderApi } from '../../../api/services/order';
import { useDebounce } from '../../../hooks/useDebounce';

// Sub-components
import OrderStats from '../components/orders/OrderStats';
import OrderFilters from '../components/orders/OrderFilters';
import OrderTable from '../components/orders/OrderTable';
import OrderDetailModal from '../components/orders/OrderDetailModal';

import 'dayjs/locale/vi';

export default function Orders() {
    const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0, size: 10 });
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async (page = 0, showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await orderApi.getAll({
                page,
                size: pageData.size,
                sort: 'id,desc',
                search: debouncedSearch || undefined,
                status: filterStatus || undefined,
                startDate: filterDate || undefined,
                endDate: filterDate || undefined,
            });
            setPageData(data);
        } catch {
            toast.error('Không tải được danh sách đơn hàng!');
        } finally {
            if (showLoading) setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, filterStatus, filterDate, pageData.size]);

    useEffect(() => { fetchOrders(0); }, [fetchOrders]);

    const handleCopyOrder = async (id) => {
        try {
            await orderApi.copy(id);
            toast.success('Sao chép đơn hàng thành công!');
            fetchOrders(0);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi sao chép đơn hàng!');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageData.totalPages) fetchOrders(newPage);
    };

    const ordersList = pageData?.content || [];

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-left duration-500">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block" />
                        Quản lý Đơn hàng
                    </h1>
                    <p className="text-slate-400 mt-1 ml-5 text-sm">Kiểm soát trạng thái, thanh toán và lịch sử giao dịch</p>
                </div>
                <button
                    onClick={() => fetchOrders(pageData.number, true)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700 active:scale-95"
                    title="Làm mới"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats summary */}
            <OrderStats
                totalElements={pageData.totalElements}
                ordersList={ordersList}
                pageNumber={pageData.number}
            />

            {/* Filters */}
            <OrderFilters
                search={search} setSearch={setSearch}
                filterDate={filterDate} setFilterDate={setFilterDate}
                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            />

            {/* Table */}
            <OrderTable
                isLoading={isLoading}
                ordersList={ordersList}
                onSelectOrder={setSelectedOrder}
                onCopyOrder={handleCopyOrder}
                pageData={pageData}
                handlePageChange={handlePageChange}
            />

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={() => fetchOrders(pageData.number, false)}
                />
            )}
        </div>
    );
}
