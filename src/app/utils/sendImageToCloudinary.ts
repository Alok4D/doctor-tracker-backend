import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

/**
 * Streams an in-memory image buffer directly to Cloudinary.
 * Compatible with both local Express servers and Vercel Serverless Functions.
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string,
  fileName?: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const publicId = fileName
      ? `${fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}`
      : `avatar-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `doctor-tracker/${folder}`,
        public_id: publicId,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Failed to upload image to Cloudinary'));
        }
        resolve(result.secure_url);
      },
    );

    uploadStream.end(buffer);
  });
};

