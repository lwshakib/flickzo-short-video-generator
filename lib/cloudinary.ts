import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./env";

/**
 * Cloudinary configuration.
 * Configures the Cloudinary SDK with credentials from environment variables.
 */
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Result structure for Cloudinary uploads.
 */
export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Uploads an audio buffer to Cloudinary using a stream.
 *
 * @param buffer - The audio data buffer.
 * @param folder - The target folder in Cloudinary.
 * @returns Object containing the secure URL and public ID.
 */
export const saveAudioToCloudinary = async (
  buffer: Buffer,
  folder = "flickzo/audio"
): Promise<CloudinaryUploadResult> => {
  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "video", // Important: Audio files are categorized as "video" in Cloudinary.
        },
        (error, result) => {
          if (error) reject(error);
          else if (result)
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          else reject(new Error("Upload returned no result"));
        }
      )
      .end(buffer);
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};

/**
 * Uploads an image buffer to Cloudinary using a stream.
 *
 * @param buffer - The image data buffer.
 * @param folder - The target folder in Cloudinary.
 * @returns Object containing the secure URL and public ID.
 */
export const saveImageToCloudinary = async (
  buffer: Buffer,
  folder = "flickzo/images"
): Promise<CloudinaryUploadResult> => {
  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result)
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          else reject(new Error("Upload returned no result"));
        }
      )
      .end(buffer);
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video"
) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
