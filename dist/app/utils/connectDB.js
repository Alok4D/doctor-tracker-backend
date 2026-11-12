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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
let cachedConnection = null;
/**
 * Establishes and caches a MongoDB connection across serverless invocations
 * to prevent connection exhaustion and minimize cold-start latency.
 */
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default;
    }
    if (!cachedConnection) {
        cachedConnection = mongoose_1.default.connect(config_1.default.database_url);
    }
    try {
        yield cachedConnection;
        return mongoose_1.default;
    }
    catch (error) {
        cachedConnection = null;
        throw error;
    }
});
exports.connectDB = connectDB;
