"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const captcha_canvas_1 = require("captcha-canvas");
const captchaCreate = () => {
    function generateCaptcha() {
        const length = 6;
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let retVal = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    const genCaptcha = generateCaptcha();
    const captcha = new captcha_canvas_1.CaptchaGenerator()
        .setDimension(150, 450)
        .setCaptcha({
        text: genCaptcha,
        size: 60,
        color: 'deeppink'
    })
        .setDecoy({
        opacity: 1
    })
        .setTrace({
        color: 'deeppink'
    });
    return {
        buffer: captcha.generateSync(),
        text: genCaptcha
    };
};
exports.default = captchaCreate;
