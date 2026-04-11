import {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";

// Determine if we should read from .env if we run this locally
import * as dotenv from "dotenv";
dotenv.config();

const AWS_REGION = process.env.AWS_REGION || "auto";
const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

async function setup() {
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
    console.log(`Creating bucket: ${AWS_S3_BUCKET_NAME}...`);
    await client.send(
      new CreateBucketCommand({
        Bucket: AWS_S3_BUCKET_NAME,
      })
    );
    console.log("Bucket created successfully.");

    console.log("Setting up CORS configuration...");
    await client.send(
      new PutBucketCorsCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              AllowedOrigins: ["*"], // Restrict this to your frontend URL in production
              ExposeHeaders: [],
              MaxAgeSeconds: 3000,
            },
          ],
        },
      })
    );
    console.log("CORS configured successfully.");
  } catch (error) {
    console.error("Error setting up bucket:", error);
    // Continue even if bucket exists
  }
}

setup();
