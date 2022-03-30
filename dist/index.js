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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = core.getInput('token');
        const octokit = github.getOctokit(token);
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const thresholdDate = new Date(Date.now() - THIRTY_DAYS);
        const pulls = [];
        let pageNum = 0;
        while (true) {
            core.debug('fetching pulls');
            const pullCandidates = yield octokit.rest.pulls.list({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                state: 'all',
                sort: 'created',
                direction: 'desc',
                page: pageNum++
            });
            const pullsAboveThreshold = pullCandidates.data.filter(d => new Date(d.created_at) >= thresholdDate);
            pulls.push(...pullsAboveThreshold);
            if (pullsAboveThreshold.length < pullCandidates.data.length) {
                break;
            }
        }
        const durationsMs = pulls.map(getPullDurationMs);
        const avgMs = durationsMs.slice(1).reduce((prev, curr, idx) => {
            return (prev * idx + curr) / (idx + 1);
        }, durationsMs[0]);
        core.info(`Found ${pulls.length} pull request created after ${thresholdDate}`);
        core.info(`Average active time: ${msToDays(avgMs)} d`);
        core.info(`Minimum active time: ${msToDays(Math.min(...durationsMs))} d`);
        core.info(`Maximum active time: ${msToDays(Math.max(...durationsMs))} d`);
    });
}
function getPullDurationMs(pull) {
    var _a, _b;
    return new Date((_b = (_a = pull.closed_at) !== null && _a !== void 0 ? _a : pull.merged_at) !== null && _b !== void 0 ? _b : Date.now()).valueOf() - new Date(pull.created_at).valueOf();
}
function msToDays(ms) {
    return Math.round((ms / (1000 * 60 * 60 * 24)) * 100) / 100;
}
main();
