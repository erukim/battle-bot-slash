"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    platform: String,
    userid: String,
    published_date: { type: Date, default: Date.now, expires: 43200 }
});
const HeartSchema = (0, mongoose_1.model)('heartCheck', schema, 'heartCheck');
HeartSchema.schema.index({ published_date: 1 }, { expireAfterSeconds: 43200 });
exports.default = HeartSchema;
