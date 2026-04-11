import {
  S3Client,
  DeleteBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

import * as dotenv from "dotenv";
dotenv.config();

const AWS_REGION = process.env.AWS_REGION || "auto";
const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

async function teardown() {
  if (
    !AWS_REGION ||
    !AWS_ENDPOINT ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_S3_BUCKET_NAME
  ) {
    console.error("Missing AWS/S3 credentials in environment variables.");
    process.exit(1);
  }

  const client = new S3Client({
    region: AWS_REGION,
    endpoint: AWS_ENDPOINT,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  try {
    console.log(`Fetching objects from bucket: ${AWS_S3_BUCKET_NAME}...`);
    // NOTE: This handles up to 1000 objects. For more, pagination is needed.
    const listedObjects = await client.send(
      new ListObjectsV2Command({ Bucket: AWS_S3_BUCKET_NAME })
    );

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      console.log(`Deleting ${listedObjects.Contents.length} objects...`);
      const deleteParams = {
        Bucket: AWS_S3_BUCKET_NAME,
        Delete: {
          Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
        },
      };
      await client.send(new DeleteObjectsCommand(deleteParams));
      console.log("Objects deleted successfully.");
    } else {
      console.log("No objects found in the bucket.");
    }

    console.log(`Deleting bucket: ${AWS_S3_BUCKET_NAME}...`);
    await client.send(
      new DeleteBucketCommand({
        Bucket: AWS_S3_BUCKET_NAME,
      })
    );
    console.log("Bucket deleted successfully.");
  } catch (error) {
    console.error("Error tearing down bucket:", error);
  }
}

teardown();
