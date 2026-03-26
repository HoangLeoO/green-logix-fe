import React from 'react';
import { STATUS_CONFIG } from './OrderConstants';

export function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
            <Icon className="w-3.5 h-3.5" />{cfg.label}
        </span>
    );
}
