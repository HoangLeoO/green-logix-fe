import { create } from 'zustand';

export const useConfirmStore = create((set) => ({
    isOpen: false,
    config: {
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy chi tiết',
        type: 'warning', // 'warning', 'danger', 'info'
        onConfirm: () => { },
    },
    showConfirm: (config) => set((state) => ({
        isOpen: true,
        config: { ...state.config, ...config }
    })),
    closeConfirm: () => set({ isOpen: false }),
}));
