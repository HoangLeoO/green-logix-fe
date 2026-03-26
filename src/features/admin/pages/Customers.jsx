import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { customerApi } from '../../../api/services/customer';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { useDebounce } from '../../../hooks/useDebounce';

// Modals
import CustomerModal from '../components/CustomerModal';
import CustomerDetailsModal from '../components/customers/CustomerDetailsModal';
import PaymentModal from '../components/customers/PaymentModal';

// Sub-components
import CustomerHeader from '../components/customers/CustomerHeader';
import CustomerFilters from '../components/customers/CustomerFilters';
import CustomerTable from '../components/customers/CustomerTable';

export default function Customers() {
    // ... stats ...
    const [pageData, setPageData] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const showConfirm = useConfirmStore((state) => state.showConfirm);

    // Modal states
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Fetch dữ liệu
    const fetchCustomers = useCallback(async (page = 0, size = 10, search = '', showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await customerApi.getAll({
                page,
                size,
                search: search ? search.trim() : ''
            });

            if (data && data.content) {
                setPageData(data);
            } else if (Array.isArray(data)) {
                setPageData({
                    content: data,
                    totalPages: 1,
                    totalElements: data.length,
                    number: 0,
                    size: 10
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách khách hàng:", error);
            if (showLoading) toast.error("Lỗi kết nối Server. Vui lòng kiểm tra Backend!");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers(0, pageData.size, debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchCustomers, pageData.size]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < (pageData?.totalPages || 0)) {
            fetchCustomers(newPage, pageData.size, debouncedSearchTerm);
        }
    };

    const handleModalSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (!selectedCustomer) {
                await customerApi.create(data);
                toast.success("Thêm khách hàng thành công!");
            } else {
                await customerApi.update(selectedCustomer.id, data);
                toast.success("Cập nhật thông tin thành công!");
            }
            setIsModalOpen(false);
            fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (customer) => {
        showConfirm({
            title: 'Xóa khách hàng',
            message: `Bạn có chắc chắn muốn xóa khách hàng "${customer.name}" ? Hành động này không thể hoàn tác.`,
            confirmText: 'Xóa ngay',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await customerApi.delete(customer.id);
                    toast.success(`Đã xóa khách hàng ${customer.name} `);
                    fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, false);
                } catch (error) {
                    toast.error("Không thể xóa khách hàng.");
                }
            }
        });
    };

    const handleApprove = (customer) => {
        showConfirm({
            title: 'Duyệt đăng ký mới',
            message: `Xác nhận phê duyệt đối tác "${customer.name}" ? Sau khi duyệt họ có thể đặt hàng.`,
            confirmText: 'Duyệt',
            type: 'success',
            onConfirm: async () => {
                try {
                    await customerApi.updateStatus(customer.id, 'approved');
                    toast.success(`Đã duyệt khách hàng ${customer.name} `);
                    fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, false);
                } catch (error) {
                    toast.error("Không thể duyệt khách hàng.");
                }
            }
        });
    };

    const customersList = pageData?.content || [];

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            <CustomerHeader
                fetchCustomers={() => fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, true)}
                isLoading={isLoading}
                handleOpenAdd={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
            />

            <CustomerFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <CustomerTable
                isLoading={isLoading}
                customersList={customersList}
                handleApprove={handleApprove}
                onOpenDetails={(c) => { setSelectedCustomer(c); setIsDetailsOpen(true); }}
                handleOpenEdit={(c) => { setSelectedCustomer(c); setIsModalOpen(true); }}
                handleOpenPayment={(c) => { setSelectedCustomer(c); setIsPaymentModalOpen(true); }}
                handleDelete={handleDelete}
                pageData={pageData}
                handlePageChange={handlePageChange}
            />

            {isDetailsOpen && selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}

            {isModalOpen && (
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={selectedCustomer}
                    isSubmitting={isSubmitting}
                />
            )}

            {isPaymentModalOpen && selectedCustomer && (
                <PaymentModal
                    customer={selectedCustomer}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={() => fetchCustomers(pageData.number, pageData.size, debouncedSearchTerm, false)}
                />
            )}
        </div>
    );
}
