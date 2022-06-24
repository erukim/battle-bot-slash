"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userid: { type: String },
    stocks: { type: [] }
});
const StockSchema = (0, mongoose_1.model)('stock', schema, 'stock');
exports.default = StockSchema;
