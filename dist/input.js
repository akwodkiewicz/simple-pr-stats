"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInput = void 0;
const core = __importStar(require("@actions/core"));
const DEFAULT_DAYS_BACK = 30;
function parseInput() {
    const token = core.getInput("token", { required: true });
    const rawDaysBack = core.getInput("days_back") || undefined;
    let daysBack;
    if (rawDaysBack) {
        daysBack = Number.parseFloat(rawDaysBack);
        if (Number.isNaN(daysBack)) {
            throw Error("days_back is not a valid number");
        }
    }
    else {
        daysBack = DEFAULT_DAYS_BACK;
    }
    const labelsToIgnore = core
        .getInput("labels_to_ignore")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    const overrideOwner = core.getInput("override_owner") || undefined;
    const overrideRepo = core.getInput("override_repo") || undefined;
    return {
        token,
        daysBack,
        labelsToIgnore,
        overrideRepo,
        overrideOwner,
    };
}
exports.parseInput = parseInput;
