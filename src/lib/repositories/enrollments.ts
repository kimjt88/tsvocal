import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "ENROLLMENT";

export type EnrollmentStatus = "new" | "contacted" | "booked" | "done" | "cancelled";

export type Enrollment = {
  pk: string;
  sk: string;
  id: string;
  name: string;
  phone: string;
  email?: string;
  programId?: string;
  programName?: string;
  message?: string;
  status: EnrollmentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export async function listEnrollments() {
  const items = await listByPk<Enrollment>(PK);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getEnrollment(id: string) {
  return getItem<Enrollment>(PK, id);
}

export type EnrollmentInput = Omit<
  Enrollment,
  "pk" | "sk" | "id" | "createdAt" | "updatedAt"
>;

export async function createEnrollment(input: EnrollmentInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: Enrollment = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateEnrollment(id: string, input: Partial<EnrollmentInput>) {
  const existing = await getEnrollment(id);
  if (!existing) throw new Error("not_found");
  const item: Enrollment = {
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

export async function deleteEnrollment(id: string) {
  await deleteItem(PK, id);
}
