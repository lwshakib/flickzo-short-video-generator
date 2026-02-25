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

export const cloudinaryClient = cloudinary;

/**
 * Result structure for the audio upload.
 */
export interface SaveAudioToCloudinaryResult {
  audioUrl: string;
  publicId: string;
}

/**
 * Uploads an audio buffer to Cloudinary using a stream.
 *
 * @param buffer The Buffer containing audio data (e.g., from an AI TTS engine).
 * @param folder The target folder in Cloudinary for the uploaded file.
 * @returns A promise resolving to the secure URL and public ID of the uploaded asset.
 */
export const saveAudioToCloudinary = async (
  buffer: Buffer,
  folder = "infera-notebook/audio"
): Promise<SaveAudioToCloudinaryResult> => {
  // Wrap the Cloudinary upload_stream in a Promise for async/await compatibility
  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinaryClient.uploader
      .upload_stream(
        {
          folder,
          resource_type: "video", // Important: Audio files are typically categorized as "video" in Cloudinary.
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          } else {
            reject(new Error("Upload returned no result"));
          }
        }
      )
      .end(buffer); // Pipe the buffer to the upload stream
  });

  return {
    audioUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};
