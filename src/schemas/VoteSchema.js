"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoteSchema = new mongoose_1.Schema({
    guild_id: String,
    message_id: String,
    vote_items: [
        {
            item_id: String,
            item_name: String,
            vote: Number,
            voted: [String]
        }
    ],
    status: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'votes' });
const Votes = (0, mongoose_1.model)('votes', VoteSchema, 'votes');
exports.default = Votes;
