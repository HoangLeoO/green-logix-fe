import React from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle2 } from 'lucide-react';
import { useConfirmStore } from '../../store/useConfirmStore';

export default function GlobalConfirmModal() {
    const { isOpen, config, closeConfirm } = useConfirmStore();

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (config.onConfirm) {
            config.onConfirm();
        }
        closeConfirm();
    };

    const icons = {
        warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
        danger: <Trash2 className="w-6 h-6 text-red-500" />,
        info: <Info className="w-6 h-6 text-blue-500" />,
        success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />
    };

    const bgColors = {
        warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-slate-900',
        danger: 'bg-red-600 hover:bg-red-500 shadow-red-600/20 text-white',
        info: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 text-white',
        success: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white'
    };

    const type = config.type || 'warning';

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={closeConfirm}
            ></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-full ${type === 'danger' ? 'bg-red-500/10' :
                            type === 'info' ? 'bg-blue-500/10' :
                                type === 'success' ? 'bg-emerald-500/10' :
                                    'bg-amber-500/10'
                            }`}>
                            {icons[type]}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-2">{config.title || 'Xác nhận'}</h3>
                    <p className="text-slate-400 text-center text-sm">{config.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}</p>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-center gap-3">
                    <button
                        onClick={closeConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                    >
                        {config.cancelText || 'Hủy'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-lg ${bgColors[type]}`}
                    >
                        {config.confirmText || 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
}
