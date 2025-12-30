
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./env";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
});

export const cloudinaryClient = cloudinary;

export interface SaveAudioToCloudinaryResult {
    audioUrl: string;
    publicId: string;
}

export const saveAudioToCloudinary = async (
    buffer: Buffer,
    folder = "infera-notebook/audio"
): Promise<SaveAudioToCloudinaryResult> => {
    const uploadResult = await new Promise<{
        secure_url: string;
        public_id: string;
    }>((resolve, reject) => {
        cloudinaryClient.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: "video", // Audio is treated as video resource type in Cloudinary usually
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
            .end(buffer);
    });

    return {
        audioUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
    };
};