import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "TEACHER";

export type Teacher = {
  pk: string;
  sk: string;
  id: string;
  name: string;
  englishName?: string;
  role: string;
  bio?: string;
  photoKey?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listTeachers() {
  const items = await listByPk<Teacher>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getTeacher(id: string) {
  return getItem<Teacher>(PK, id);
}

export type TeacherInput = Omit<Teacher, "pk" | "sk" | "id" | "createdAt" | "updatedAt">;

export async function createTeacher(input: TeacherInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: Teacher = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateTeacher(id: string, input: TeacherInput) {
  const existing = await getTeacher(id);
  if (!existing) throw new Error("not_found");
  const item: Teacher = {
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

export async function deleteTeacher(id: string) {
  await deleteItem(PK, id);
}
