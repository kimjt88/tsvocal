import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "BEFORE_AFTER";

export type BAMetric = {
  label: string;
  change: string;
  before: number;
  after: number;
};

export type BeforeAfter = {
  pk: string;
  sk: string;
  id: string;
  initial: string;
  studentName: string;
  studentInfo: string;
  metrics: BAMetric[];
  quote: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BeforeAfterInput = Omit<
  BeforeAfter,
  "pk" | "sk" | "id" | "createdAt" | "updatedAt"
>;

export async function listBeforeAfters() {
  const items = await listByPk<BeforeAfter>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getBeforeAfter(id: string) {
  return getItem<BeforeAfter>(PK, id);
}

export async function createBeforeAfter(input: BeforeAfterInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: BeforeAfter = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateBeforeAfter(id: string, input: BeforeAfterInput) {
  const existing = await getBeforeAfter(id);
  if (!existing) throw new Error("not_found");
  const item: BeforeAfter = { ...existing, ...input, pk: PK, sk: id, id, updatedAt: new Date().toISOString() };
  await putItem(item);
  return item;
}

export async function deleteBeforeAfter(id: string) {
  await deleteItem(PK, id);
}
