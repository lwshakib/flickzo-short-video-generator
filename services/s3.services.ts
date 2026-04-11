import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_REGION,
  AWS_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
} from "@/lib/env";

class S3ServiceClass {
  private getClient(): S3Client {
    if (
      !AWS_REGION ||
      !AWS_ENDPOINT ||
      !AWS_ACCESS_KEY_ID ||
      !AWS_SECRET_ACCESS_KEY
    ) {
      throw new Error("Missing AWS/S3 credentials in environment variables.");
    }

    return new S3Client({
      region: AWS_REGION,
      endpoint: AWS_ENDPOINT,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      // When using Cloudflare R2 or similar custom S3 endpoints, you typically need to force path style
      forcePathStyle: true,
    });
  }

  /**
   * Upload an audio buffer to S3.
   * @param buffer Raw file buffer
   * @param fileName File name or target path in bucket
   */
  public async uploadAudio(buffer: Buffer, fileName: string): Promise<string> {
    const client = this.getClient();
    const path = `flickzo/audio/${Date.now()}-${fileName}`;

    await client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: path,
        Body: buffer,
        ContentType: "audio/mpeg",
      })
    );

    return path;
  }

  /**
   * Upload an image buffer to S3.
   * @param buffer Raw image buffer
   * @param fileName File name or target path in bucket
   */
  public async uploadImage(buffer: Buffer, fileName: string): Promise<string> {
    const client = this.getClient();
    const path = `flickzo/images/${Date.now()}-${fileName}`;

    await client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: path,
        Body: buffer,
        ContentType: "image/png",
      })
    );

    return path;
  }

  /**
   * Generates a signed URL for reading/downloading an object.
   * @param path The key/path of the object in the S3 bucket.
   */
  public async getSignedUrl(path: string): Promise<string> {
    const client = this.getClient();
    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: path,
    });

    // URL expires in 1 hour
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }

  /**
   * Generates a presigned URL that the client can use to upload a file directly to S3.
   * @param path The key/path of the object.
   * @param contentType The MIME type of the file.
   */
  public async getPresignedUploadUrl(
    path: string,
    contentType: string
  ): Promise<string> {
    const client = this.getClient();
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: path,
      ContentType: contentType,
    });

    // URL expires in 15 minutes
    return await getSignedUrl(client, command, { expiresIn: 900 });
  }

  /**
   * Delete an object from the S3 bucket.
   * @param path The key/path of the object.
   */
  public async deleteObject(path: string): Promise<void> {
    const client = this.getClient();
    await client.send(
      new DeleteObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: path,
      })
    );
  }
}

export const s3Service = new S3ServiceClass();
