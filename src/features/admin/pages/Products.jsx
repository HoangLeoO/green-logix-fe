import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { productApi } from '../../../api/services/product';
import { categoryApi } from '../../../api/services/category';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { useDebounce } from '../../../hooks/useDebounce';

// Modals
import ProductModal from '../components/ProductModal';
import StockHistoryModal from '../components/StockHistoryModal';

// Sub-components
import ProductHeader from '../components/products/ProductHeader';
import ProductFilters from '../components/products/ProductFilters';
import ProductTable from '../components/products/ProductTable';

export default function Products() {
    const [pageData, setPageData] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const showConfirm = useConfirmStore((state) => state.showConfirm);

    // Modal states
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyProduct, setHistoryProduct] = useState(null);

    // Fetch danh mục để lọc
    const fetchCategories = async () => {
        try {
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    // Fetch dữ liệu sản phẩm
    const fetchProducts = useCallback(async (page = 0, size = 10, search = '', categoryId = '', showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const params = {
                page,
                size,
                search: search ? search.trim() : ''
            };
            if (categoryId) params.categoryId = categoryId;

            const data = await productApi.getAll(params);

            if (data && data.content) {
                setPageData(data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
            if (showLoading) toast.error("Lỗi kết nối Server. Vui lòng thử lại!");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(0, pageData.size, debouncedSearchTerm, selectedCategoryId);
    }, [debouncedSearchTerm, selectedCategoryId, fetchProducts, pageData.size]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < (pageData?.totalPages || 0)) {
            fetchProducts(newPage, pageData.size, debouncedSearchTerm, selectedCategoryId);
        }
    };

    const handleModalSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                category: data.categoryId ? { id: parseInt(data.categoryId) } : null
            };
            delete payload.categoryId;

            if (!selectedProduct) {
                await productApi.create(payload);
                toast.success("Thêm sản phẩm mới thành công!");
            } else {
                await productApi.update(selectedProduct.id, payload);
                toast.success("Cập nhật sản phẩm thành công!");
            }
            setIsModalOpen(false);
            fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId, false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (product) => {
        showConfirm({
            title: 'Xóa sản phẩm',
            message: `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
            confirmText: 'Xóa vĩnh viễn',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await productApi.delete(product.id);
                    toast.success("Đã xóa sản phẩm");
                    fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId, false);
                } catch (error) {
                    toast.error("Không thể xóa sản phẩm.");
                }
            }
        });
    };

    const handleToggleStatus = async (product) => {
        try {
            const payload = {
                ...product,
                isActive: !product.isActive,
                category: product.category?.id ? { id: product.category.id } : null
            };

            await productApi.update(product.id, payload);
            toast.success(`Đã ${!product.isActive ? 'mở' : 'tạm dừng'} kinh doanh: ${product.name}`);
            fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId, false);
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái.");
        }
    };

    const productsList = pageData?.content || [];

    return (
        <div className="p-4 md:p-8 font-sans pb-24 md:pb-8">
            <ProductHeader
                fetchProducts={() => fetchProducts(pageData.number, pageData.size, debouncedSearchTerm, selectedCategoryId)}
                isLoading={isLoading}
                handleOpenAdd={() => { setSelectedProduct(null); setIsModalOpen(true); }}
            />

            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                categories={categories}
            />

            <ProductTable
                isLoading={isLoading}
                productsList={productsList}
                handleToggleStatus={handleToggleStatus}
                handleOpenHistory={(p) => { setHistoryProduct(p); setIsHistoryOpen(true); }}
                handleOpenEdit={(p) => { setSelectedProduct(p); setIsModalOpen(true); }}
                handleDelete={handleDelete}
                pageData={pageData}
                handlePageChange={handlePageChange}
            />

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={selectedProduct}
                    isSubmitting={isSubmitting}
                />
            )}

            {isHistoryOpen && (
                <StockHistoryModal
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    product={historyProduct}
                />
            )}
        </div>
    );
}
