"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong!';
    let errorSources = [
        {
            path: '',
            message: err.message || 'Something went wrong',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorSources = err.issues.map((issue) => {
            var _a;
            return ({
                path: String((_a = issue.path[issue.path.length - 1]) !== null && _a !== void 0 ? _a : ''),
                message: issue.message,
            });
        });
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        errorSources = [
            {
                path: String(err.path || ''),
                message: err.message,
            },
        ];
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        statusCode = 400;
        message = 'Duplicate Key Error';
        const match = err.message.match(/"([^"]*)"/);
        const extractedMessage = match && match[1];
        errorSources = [
            {
                path: Object.keys(err.keyPattern || {})[0] || '',
                message: `${extractedMessage} already exists`,
            },
        ];
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.NODE_ENV === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
