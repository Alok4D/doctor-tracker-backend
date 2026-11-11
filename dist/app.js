"use strict";
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
const app = (0, express_1.default)();
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
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
