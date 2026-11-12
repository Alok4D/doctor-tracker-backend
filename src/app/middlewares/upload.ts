import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import multer from 'multer';
import AppError from '../errors/AppError';
import { uploadBufferToCloudinary } from '../utils/sendImageToCloudinary';

const storage = multer.memoryStorage();

const multerUpload = multer({
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
    } else {
      cb(
        new AppError(
          httpStatus.BAD_REQUEST,
          'Only JPG, JPEG, PNG, and WEBP image files are allowed',
        ),
      );
    }
  },
}).any();

/**
 * Middleware that accepts both multipart/form-data (with an optional photo file
 * under any image field such as 'photo', 'file', or 'avatar') and application/json.
 * If an image file is provided, uploads it to Cloudinary and attaches `req.body.avatarUrl`.
 */
export const parseFormDataWithOptionalImage = (folder: 'doctors' | 'patients') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'] || '';

    // Allow regular application/json payloads seamlessly
    if (!contentType.includes('multipart/form-data')) {
      return next();
    }

    multerUpload(req, res, async (err: any) => {
      if (err) {
        return next(
          new AppError(
            httpStatus.BAD_REQUEST,
            err.message || 'File upload failed',
          ),
        );
      }

      try {
        // Support optional JSON-encoded `data` field inside form-data
        if (req.body && typeof req.body.data === 'string') {
          const parsedData = JSON.parse(req.body.data);
          req.body = { ...req.body, ...parsedData };
          delete req.body.data;
        }

        // Remove empty avatarUrl string if sent from an empty form input
        if (req.body && req.body.avatarUrl === '') {
          delete req.body.avatarUrl;
        }

        const files = req.files as Express.Multer.File[] | undefined;
        const uploadedFile = files && files.length > 0 ? files[0] : req.file;

        if (uploadedFile && uploadedFile.buffer) {
          const imageUrl = await uploadBufferToCloudinary(
            uploadedFile.buffer,
            folder,
            uploadedFile.originalname,
          );
          req.body.avatarUrl = imageUrl;
        }

        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
};

