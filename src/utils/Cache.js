"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStocksCache = exports.stockCache = exports.searchStockCache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
exports.searchStockCache = new node_cache_1.default({ stdTTL: 60 * 70 });
exports.stockCache = new node_cache_1.default({ stdTTL: 60 * 40 });
exports.searchStocksCache = new node_cache_1.default({ stdTTL: 60 * 70 });
