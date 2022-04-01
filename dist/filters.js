"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelFilter = exports.dateFilter = void 0;
function dateFilter(daysBack) {
    const ms = daysBack * 24 * 60 * 60 * 1000;
    const thresholdDate = new Date(Date.now() - ms);
    return (p) => {
        return new Date(p.created_at) >= thresholdDate;
    };
}
exports.dateFilter = dateFilter;
function labelFilter(labelsToIgnore) {
    return (p) => {
        return labelsToIgnore.every((labelToIgnore) => !p.labels.map((l) => l.name).includes(labelToIgnore));
    };
}
exports.labelFilter = labelFilter;
