import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "WHY_FEATURE";

export type WhyFeature = {
  pk: string;
  sk: string;
  id: string;
  number: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WhyFeatureInput = Omit<WhyFeature, "pk" | "sk" | "id" | "createdAt" | "updatedAt">;

export async function listWhyFeatures() {
  const items = await listByPk<WhyFeature>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getWhyFeature(id: string) {
  return getItem<WhyFeature>(PK, id);
}

export async function createWhyFeature(input: WhyFeatureInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: WhyFeature = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateWhyFeature(id: string, input: WhyFeatureInput) {
  const existing = await getWhyFeature(id);
  if (!existing) throw new Error("not_found");
  const item: WhyFeature = { ...existing, ...input, pk: PK, sk: id, id, updatedAt: new Date().toISOString() };
  await putItem(item);
  return item;
}

export async function deleteWhyFeature(id: string) {
  await deleteItem(PK, id);
}
