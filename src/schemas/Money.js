"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    money: { type: Number },
    userid: { type: String },
    date: { type: String }
});
const MoneySchema = (0, mongoose_1.model)('money', schema, 'money');
exports.default = MoneySchema;
