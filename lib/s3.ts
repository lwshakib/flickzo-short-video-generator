import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as presignUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_REGION,
  AWS_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
} from "@/lib/env";

function getClient(): S3Client {
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
    forcePathStyle: true,
  });
}

/** Upload an audio buffer to S3. Returns the object key. */
export async function uploadAudio(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const client = getClient();
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

/** Upload an image buffer to S3. Returns the object key. */
export async function uploadImage(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const client = getClient();
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

/** Presigned GET URL for reading an object (1 hour). */
/** Presigned GET URL for reading an object (1 hour). */
export async function getSignedUrl(path: string): Promise<string> {
  if (path.includes("..") || !path.startsWith("flickzo/")) {
    throw new Error("Invalid S3 path");
  }
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: path,
  });

  return await presignUrl(client, command, { expiresIn: 3600 });
}

/** Presigned PUT URL for direct client uploads (15 minutes). */
export async function getPresignedUploadUrl(
  path: string,
  contentType: string
): Promise<string> {
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: path,
    ContentType: contentType,
  });

  return await presignUrl(client, command, { expiresIn: 900 });
}

export async function deleteObject(path: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: path,
    })
  );
}
