"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AlertSchema = new mongoose_1.Schema({
    user_id: String,
    message: [
        {
            published_date: { type: Date, default: Date.now },
            read: Boolean,
            title: String,
            message: String,
            button: {
                url: String,
                value: String
            }
        }
    ],
    published_date: { type: Date, default: Date.now }
});
const Alert = (0, mongoose_1.model)('alerts', AlertSchema, 'alerts');
exports.default = Alert;
