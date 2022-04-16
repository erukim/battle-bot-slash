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
const userSchema_1 = __importDefault(require("../schemas/userSchema"));
const alertSchema_1 = __importDefault(require("../schemas/alertSchema"));
const alertSender = (title, message, url, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user_id) {
        const update = yield alertSchema_1.default.updateMany({}, {
            $push: {
                message: {
                    title: title,
                    message: message,
                    button: (url === null || url === void 0 ? void 0 : url.url) ? url : null,
                    read: false
                }
            }
        }, { upsert: true });
        if (!update)
            throw new Error('알림을 전송하는데 실패했습니다.');
        return true;
    }
    else {
        const user = yield userSchema_1.default.findOne({ id: user_id });
        if (!user)
            throw new Error('유저가 웹 대시보드를 로그인한 기록이 존재하지 않습니다.');
        const update = yield alertSchema_1.default.updateOne({ user_id: user_id }, {
            $push: {
                message: {
                    title: title,
                    message: message,
                    button: (url === null || url === void 0 ? void 0 : url.url) ? url : null,
                    read: false
                }
            }
        }, { upsert: true });
        if (!update)
            throw new Error('알림을 전송하는데 실패했습니다.');
        return true;
    }
});
exports.default = alertSender;
