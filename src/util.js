"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomRoll = void 0;
function getRandomRoll(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.getRandomRoll = getRandomRoll;
