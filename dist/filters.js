"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftFilter = exports.labelFilter = exports.dateFilter = void 0;
function dateFilter(daysBack) {
    const ms = daysBack * 24 * 60 * 60 * 1000;
    const timeWindowStart = new Date(Date.now() - ms);
    return (p) => {
        var _a;
        const finishDateString = (_a = p.merged_at) !== null && _a !== void 0 ? _a : p.closed_at;
        return finishDateString
            ? new Date(finishDateString) >= timeWindowStart
            : true;
    };
}
exports.dateFilter = dateFilter;
function labelFilter(labelsToIgnore) {
    return (p) => {
        return labelsToIgnore.every((labelToIgnore) => !p.labels.map((l) => l.name).includes(labelToIgnore));
    };
}
exports.labelFilter = labelFilter;
function draftFilter(includeDrafts) {
    return (p) => (includeDrafts ? true : !p.draft);
}
exports.draftFilter = draftFilter;
