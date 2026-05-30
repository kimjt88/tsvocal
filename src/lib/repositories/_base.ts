import "server-only";

import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { ddb } from "../dynamodb";
import { env } from "../env";

export const SINGLETON_SK = "SINGLETON";

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type EntityKey = { pk: string; sk: string };

export async function getItem<T>(pk: string, sk: string): Promise<T | null> {
  const out = await ddb.send(
    new GetCommand({ TableName: env.academyTable, Key: { pk, sk } }),
  );
  return (out.Item as T | undefined) ?? null;
}

export async function listByPk<T>(pk: string): Promise<T[]> {
  const out = await ddb.send(
    new QueryCommand({
      TableName: env.academyTable,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: { ":pk": pk },
    }),
  );
  return (out.Items ?? []) as T[];
}

export async function putItem<T extends EntityKey>(item: T) {
  await ddb.send(new PutCommand({ TableName: env.academyTable, Item: item }));
}

export async function deleteItem(pk: string, sk: string) {
  await ddb.send(
    new DeleteCommand({ TableName: env.academyTable, Key: { pk, sk } }),
  );
}
