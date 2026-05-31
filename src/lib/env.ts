import "server-only";

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export const env = {
  awsRegion: process.env.APP_REGION ?? "ap-northeast-2",
  awsAccessKeyId: required("APP_ACCESS_KEY_ID"),
  awsSecretAccessKey: required("APP_SECRET_ACCESS_KEY"),
  adminsTable: process.env.DYNAMODB_ADMINS_TABLE ?? "Admins",
  academyTable: process.env.DYNAMODB_ACADEMY_TABLE ?? "AcademyData",
  s3Bucket: process.env.S3_BUCKET_NAME ?? "tsvocal",
  sessionSecret: required("ADMIN_SESSION_SECRET"),
  encryptionKey: required("APP_ENCRYPTION_KEY"),
};
