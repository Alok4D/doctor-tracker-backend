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
exports.parseFormDataWithOptionalImage = void 0;
const http_status_1 = __importDefault(require("http-status"));
const multer_1 = __importDefault(require("multer"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const sendImageToCloudinary_1 = require("../utils/sendImageToCloudinary");
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Only JPG, JPEG, PNG, and WEBP image files are allowed'));
        }
    },
}).any();
/**
 * Middleware that accepts both multipart/form-data (with an optional photo file
 * under any image field such as 'photo', 'file', or 'avatar') and application/json.
 * If an image file is provided, uploads it to Cloudinary and attaches `req.body.avatarUrl`.
 */
const parseFormDataWithOptionalImage = (folder) => {
    return (req, res, next) => {
        const contentType = req.headers['content-type'] || '';
        // Allow regular application/json payloads seamlessly
        if (!contentType.includes('multipart/form-data')) {
            return next();
        }
        multerUpload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(new AppError_1.default(http_status_1.default.BAD_REQUEST, err.message || 'File upload failed'));
            }
            try {
                // Support optional JSON-encoded `data` field inside form-data
                if (req.body && typeof req.body.data === 'string') {
                    const parsedData = JSON.parse(req.body.data);
                    req.body = Object.assign(Object.assign({}, req.body), parsedData);
                    delete req.body.data;
                }
                // Remove empty avatarUrl string if sent from an empty form input
                if (req.body && req.body.avatarUrl === '') {
                    delete req.body.avatarUrl;
                }
                const files = req.files;
                const uploadedFile = files && files.length > 0 ? files[0] : req.file;
                if (uploadedFile && uploadedFile.buffer) {
                    const imageUrl = yield (0, sendImageToCloudinary_1.uploadBufferToCloudinary)(uploadedFile.buffer, folder, uploadedFile.originalname);
                    req.body.avatarUrl = imageUrl;
                }
                next();
            }
            catch (uploadError) {
                next(uploadError);
            }
        }));
    };
};
exports.parseFormDataWithOptionalImage = parseFormDataWithOptionalImage;
