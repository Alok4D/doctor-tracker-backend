"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
/**
 * Streams an in-memory image buffer directly to Cloudinary.
 * Compatible with both local Express servers and Vercel Serverless Functions.
 */
const uploadBufferToCloudinary = (buffer, folder, fileName) => {
    return new Promise((resolve, reject) => {
        const publicId = fileName
            ? `${fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}`
            : `avatar-${Date.now()}`;
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `doctor-tracker/${folder}`,
            public_id: publicId,
            resource_type: 'image',
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('Failed to upload image to Cloudinary'));
            }
            resolve(result.secure_url);
        });
        uploadStream.end(buffer);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
