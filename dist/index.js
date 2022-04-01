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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const filters_1 = require("./filters");
const input_1 = require("./input");
function main() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { daysBack, token, overrideOwner, overrideRepo } = (0, input_1.parseInput)();
        const octokit = github.getOctokit(token);
        const pulls = [];
        try {
            for (var _b = __asyncValues(octokit.paginate.iterator(octokit.rest.pulls.list, {
                owner: overrideOwner !== null && overrideOwner !== void 0 ? overrideOwner : github.context.repo.owner,
                repo: overrideRepo !== null && overrideRepo !== void 0 ? overrideRepo : github.context.repo.repo,
                state: "all",
                sort: "created",
                direction: "desc",
            })), _c; _c = yield _b.next(), !_c.done;) {
                const response = _c.value;
                const pullsBatch = response.data;
                const pullsAfterStartDate = pullsBatch.filter((0, filters_1.dateFilter)(daysBack));
                pulls.push(...pullsAfterStartDate);
                if (pullsAfterStartDate.length < pullsBatch.length) {
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const pullsWithDurations = pulls
            .map(attachPullDurationMs)
            .sort((p1, p2) => p1[1] - p2[1]);
        const avgMs = pullsWithDurations
            .map(([p, d]) => d)
            .slice(1)
            .reduce((prev, curr, idx) => {
            return (prev * idx + curr) / (idx + 1);
        }, pullsWithDurations[0][1]);
        core.info(`Found ${pulls.length} pull requests created in the last ${daysBack} days`);
        core.notice(`Average active time: ${msToDays(avgMs)} d`, {
            title: "Average active time",
        });
        core.notice(`Minimum active time: ${msToDays(pullsWithDurations[0][1])} d (${pullsWithDurations[0][0].html_url})`, { title: "Minimum active time" });
        core.notice(`Maximum active time: ${msToDays(pullsWithDurations[pullsWithDurations.length - 1][1])} d (${pullsWithDurations[pullsWithDurations.length - 1][0].html_url})`, { title: "Maximum active time" });
    });
}
function attachPullDurationMs(pull) {
    var _a, _b;
    return [
        pull,
        new Date((_b = (_a = pull.closed_at) !== null && _a !== void 0 ? _a : pull.merged_at) !== null && _b !== void 0 ? _b : Date.now()).valueOf() -
            new Date(pull.created_at).valueOf(),
    ];
}
function msToDays(ms) {
    return Math.round((ms / (1000 * 60 * 60 * 24)) * 100) / 100;
}
main();
