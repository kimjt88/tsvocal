import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "CURRICULUM_STEP";

export type CurriculumStep = {
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

export type CurriculumStepInput = Omit<CurriculumStep, "pk" | "sk" | "id" | "createdAt" | "updatedAt">;

export async function listCurriculumSteps() {
  const items = await listByPk<CurriculumStep>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getCurriculumStep(id: string) {
  return getItem<CurriculumStep>(PK, id);
}

export async function createCurriculumStep(input: CurriculumStepInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: CurriculumStep = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateCurriculumStep(id: string, input: CurriculumStepInput) {
  const existing = await getCurriculumStep(id);
  if (!existing) throw new Error("not_found");
  const item: CurriculumStep = { ...existing, ...input, pk: PK, sk: id, id, updatedAt: new Date().toISOString() };
  await putItem(item);
  return item;
}

export async function deleteCurriculumStep(id: string) {
  await deleteItem(PK, id);
}
