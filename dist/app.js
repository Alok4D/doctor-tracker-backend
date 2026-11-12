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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const connectDB_1 = require("./app/utils/connectDB");
const app = (0, express_1.default)();
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
// Ensure database connection is ready in serverless environments
app.use('/api/v1', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)();
        next();
    }
    catch (error) {
        next(error);
    }
}));
// Application routes under /api/v1
app.use('/api/v1', routes_1.default);
// Root route for health check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Doctor Tracker Backend API Server!',
        timestamp: new Date().toISOString(),
        documentation: '/api/v1',
    });
});
// Error handling middlewares
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
