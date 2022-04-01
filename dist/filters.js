"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFilter = void 0;
function dateFilter(daysBack) {
    const ms = daysBack * 24 * 60 * 60 * 1000;
    const thresholdDate = new Date(Date.now() - ms);
    return (p) => {
        return new Date(p.created_at) >= thresholdDate;
    };
}
exports.dateFilter = dateFilter;
