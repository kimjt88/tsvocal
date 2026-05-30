import "server-only";

import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

import { ddb } from "./dynamodb";
import { env } from "./env";

export type AdminRecord = {
  username: string;
  passwordHash: string;
  createdAt: string;
};

export async function getAdmin(username: string): Promise<AdminRecord | null> {
  const out = await ddb.send(
    new GetCommand({
      TableName: env.adminsTable,
      Key: { username },
    }),
  );
  return (out.Item as AdminRecord | undefined) ?? null;
}

export async function hasAnyAdmin(): Promise<boolean> {
  const out = await ddb.send(
    new ScanCommand({
      TableName: env.adminsTable,
      Limit: 1,
      ProjectionExpression: "username",
    }),
  );
  return (out.Count ?? 0) > 0;
}

export async function createAdmin(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  await ddb.send(
    new PutCommand({
      TableName: env.adminsTable,
      Item: {
        username,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(username)",
    }),
  );
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
