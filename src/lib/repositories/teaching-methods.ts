import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "TEACHING_METHOD";

export type TeachingMethod = {
  pk: string;
  sk: string;
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeachingMethodInput = Omit<
  TeachingMethod,
  "pk" | "sk" | "id" | "createdAt" | "updatedAt"
>;

export async function listTeachingMethods() {
  const items = await listByPk<TeachingMethod>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getTeachingMethod(id: string) {
  return getItem<TeachingMethod>(PK, id);
}

export async function createTeachingMethod(input: TeachingMethodInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: TeachingMethod = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateTeachingMethod(id: string, input: TeachingMethodInput) {
  const existing = await getTeachingMethod(id);
  if (!existing) throw new Error("not_found");
  const item: TeachingMethod = { ...existing, ...input, pk: PK, sk: id, id, updatedAt: new Date().toISOString() };
  await putItem(item);
  return item;
}

export async function deleteTeachingMethod(id: string) {
  await deleteItem(PK, id);
}
