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
exports.checkGuildPremium = exports.checkUserPremium = void 0;
const premiumSchemas_1 = __importDefault(require("../schemas/premiumSchemas"));
const premiumUserSchemas_1 = __importDefault(require("../schemas/premiumUserSchemas"));
const checkGuildPremium = (client, guild) => __awaiter(void 0, void 0, void 0, function* () {
    const premium = yield premiumSchemas_1.default.findOne({ guild_id: guild.id });
    if (!premium) {
        return false;
    }
    else {
        const now = new Date();
        const premiumDate = new Date(premium.nextpay_date);
        if (now < premiumDate) {
            return true;
        }
        else {
            return false;
        }
    }
});
exports.checkGuildPremium = checkGuildPremium;
const checkUserPremium = (client, user) => __awaiter(void 0, void 0, void 0, function* () {
    const premium = yield premiumUserSchemas_1.default.findOne({ user_id: user.id });
    if (!premium) {
        return false;
    }
    else {
        const now = new Date();
        const premiumDate = new Date(premium.nextpay_date);
        if (now < premiumDate) {
            return true;
        }
        else {
            return false;
        }
    }
});
exports.checkUserPremium = checkUserPremium;
exports.default = checkGuildPremium;
