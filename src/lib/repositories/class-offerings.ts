import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "CLASS";

export type ClassOffering = {
  pk: string;
  sk: string;
  id: string;
  badge: string;
  name: string;
  forWhom: string;
  features: string[];
  frequency: string;
  sessionLength: string;
  featured: boolean;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClassOfferingInput = Omit<
  ClassOffering,
  "pk" | "sk" | "id" | "createdAt" | "updatedAt"
>;

export async function listClassOfferings() {
  const items = await listByPk<ClassOffering>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getClassOffering(id: string) {
  return getItem<ClassOffering>(PK, id);
}

export async function createClassOffering(input: ClassOfferingInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: ClassOffering = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateClassOffering(id: string, input: ClassOfferingInput) {
  const existing = await getClassOffering(id);
  if (!existing) throw new Error("not_found");
  const item: ClassOffering = { ...existing, ...input, pk: PK, sk: id, id, updatedAt: new Date().toISOString() };
  await putItem(item);
  return item;
}

export async function deleteClassOffering(id: string) {
  await deleteItem(PK, id);
}
