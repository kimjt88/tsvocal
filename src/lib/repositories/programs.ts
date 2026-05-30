import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "PROGRAM";

export type Program = {
  pk: string;
  sk: string;
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listPrograms() {
  const items = await listByPk<Program>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getProgram(id: string) {
  return getItem<Program>(PK, id);
}

export type ProgramInput = Omit<Program, "pk" | "sk" | "id" | "createdAt" | "updatedAt">;

export async function createProgram(input: ProgramInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: Program = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateProgram(id: string, input: ProgramInput) {
  const existing = await getProgram(id);
  if (!existing) throw new Error("not_found");
  const item: Program = {
    ...existing,
    ...input,
    pk: PK,
    sk: id,
    id,
    updatedAt: new Date().toISOString(),
  };
  await putItem(item);
  return item;
}

export async function deleteProgram(id: string) {
  await deleteItem(PK, id);
}
