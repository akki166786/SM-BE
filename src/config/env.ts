import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY || "",
    secretKey: process.env.AWS_SECRET_KEY || "",
    s3Bucket: process.env.AWS_S3_BUCKET || "",
    s3Region: process.env.AWS_S3_REGION || "us-east-1",
  },
};

export const isDev = env.nodeEnv === "development";
export const isProd = env.nodeEnv === "production";
