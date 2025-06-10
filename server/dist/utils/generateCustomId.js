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
const counterSchema_1 = __importDefault(require("../schema/counterSchema"));
const generateCustomId = (typePrefix, counterKey) => __awaiter(void 0, void 0, void 0, function* () {
    const counter = yield counterSchema_1.default.findByIdAndUpdate(counterKey, { $inc: { seq: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    if (!counter) {
        throw new Error("Failed to generate ID");
    }
    return `${typePrefix}${counter.seq}`;
});
exports.default = generateCustomId;
