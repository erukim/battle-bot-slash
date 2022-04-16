"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nftVerifyUserSchema = new mongoose_1.Schema({
    guild_id: String,
    user_id: String,
    token: String,
    process: String,
    published_date: { type: Date, default: Date.now }
}, {
    collection: 'nftUserVerify'
});
const NFTUserVerify = (0, mongoose_1.model)('nftUserVerify', nftVerifyUserSchema, 'nftUserVerify');
exports.default = NFTUserVerify;
