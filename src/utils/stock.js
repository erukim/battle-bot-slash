"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStockList = exports.searchStock = exports.searchStocks = void 0;
const axios_1 = __importDefault(require("axios"));
const Cache_1 = require("./Cache");
const searchStocks = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    if (Cache_1.searchStockCache.has(keyword)) {
        return Cache_1.searchStockCache.get(keyword);
    }
    else {
        const searchData = yield axios_1.default
            .get(`https://m.stock.naver.com/api/json/search/searchListJson.nhn?keyword=${encodeURI(keyword)}`)
            .then((res) => {
            return res.data;
        })
            .catch((e) => {
            throw new Error(e.message);
        });
        Cache_1.searchStockCache.set(keyword, searchData);
        return searchData;
    }
});
exports.searchStocks = searchStocks;
const searchStock = (code) => __awaiter(void 0, void 0, void 0, function* () {
    if (Cache_1.stockCache.has(code)) {
        return Cache_1.stockCache.get(code);
    }
    else {
        const searchData = axios_1.default
            .get(`https://api.finance.naver.com/service/itemSummary.nhn?itemcode=${encodeURI(code)}`)
            .then((res) => {
            return res.data;
        })
            .catch((e) => {
            throw new Error(e.message);
        });
        Cache_1.stockCache.set(code, searchData);
        return searchData;
    }
});
exports.searchStock = searchStock;
const searchStockList = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    if (Cache_1.searchStocksCache.has(keyword)) {
        return Cache_1.searchStocksCache.get(keyword);
    }
    else {
        const searchData = axios_1.default
            .get(`https://ac.stock.naver.com/ac?q=${encodeURI(keyword)}&target=stock,index,marketindicator`)
            .then((res) => {
            return res.data;
        })
            .catch((e) => {
            throw new Error(e.message);
        });
        Cache_1.searchStocksCache.set(keyword, searchData);
        return searchData;
    }
});
exports.searchStockList = searchStockList;
