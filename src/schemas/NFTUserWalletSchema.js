"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nftUserWalletSchema = new mongoose_1.Schema({
    user_id: String,
    wallet_address: String,
    published_date: { type: Date, default: Date.now }
}, {
    collection: 'nftUserWallet'
});
const NFTUserWallet = (0, mongoose_1.model)('nftUserWallet', nftUserWalletSchema, 'nftUserWallet');
exports.default = NFTUserWallet;
