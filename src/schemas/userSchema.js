"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    _id: String,
    id: String,
    email: String,
    token: String,
    kakao_accessToken: String,
    kakao_refreshToken: String,
    kakao_email: String,
    kakao_name: String,
    tokenExp: Number,
    accessToken: String,
    refreshToken: String,
    expires_in: Number,
    google_accessToken: String,
    google_refreshToken: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'userData' });
const User = (0, mongoose_1.model)('userData', UserSchema, 'userData');
exports.default = User;
