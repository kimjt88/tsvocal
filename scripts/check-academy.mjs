import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { readFileSync } from "node:fs";

try {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.APP_REGION,
    credentials: {
      accessKeyId: process.env.APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
    },
  }),
);

const out = await ddb.send(
  new GetCommand({
    TableName: process.env.DYNAMODB_ACADEMY_TABLE ?? "AcademyData",
    Key: { pk: "ACADEMY", sk: "SINGLETON" },
  }),
);
console.log("Academy record:", out.Item ?? "(none)");
