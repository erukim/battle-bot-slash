"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hcsSchema = new mongoose_1.Schema({
    user_id: String,
    school: String,
    birthday: String,
    password: String,
    name: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'hcs' });
const hcs = (0, mongoose_1.model)('hcs', hcsSchema, 'hcs');
exports.default = hcs;
