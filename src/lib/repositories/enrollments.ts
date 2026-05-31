import "server-only";

import { decrypt, encrypt } from "../crypto";
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
  age?: string;
  gender?: string;
  lessonPurpose?: string;
  preferredLessonTime?: string;
  musicGenre?: string;
  consent?: boolean;
  programId?: string;
  programName?: string;
  message?: string;
  status: EnrollmentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Phone is encrypted at rest. The repo hides this: callers always work with
 * plaintext, and storage always holds ciphertext. Legacy plaintext records
 * (from before encryption was added) are read through decrypt() which passes
 * them through unchanged.
 */
function decryptItem(item: Enrollment): Enrollment {
  return { ...item, phone: decrypt(item.phone) ?? "" };
}

export async function listEnrollments() {
  const items = await listByPk<Enrollment>(PK);
  return items
    .map(decryptItem)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getEnrollment(id: string) {
  const item = await getItem<Enrollment>(PK, id);
  return item ? decryptItem(item) : null;
}

export type EnrollmentInput = Omit<
  Enrollment,
  "pk" | "sk" | "id" | "createdAt" | "updatedAt"
>;

export async function createEnrollment(input: EnrollmentInput) {
  const now = new Date().toISOString();
  const id = newId();
  const stored: Enrollment = {
    ...input,
    phone: encrypt(input.phone) ?? input.phone,
    pk: PK,
    sk: id,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await putItem(stored);
  return { ...stored, phone: input.phone }; // return plaintext to caller
}

export async function updateEnrollment(id: string, input: Partial<EnrollmentInput>) {
  // Read raw item directly (skipping our decrypt) so we keep the existing
  // ciphertext intact unless the caller explicitly provides a new phone.
  const existingRaw = await getItem<Enrollment>(PK, id);
  if (!existingRaw) throw new Error("not_found");
  const encryptedInput = input.phone
    ? { ...input, phone: encrypt(input.phone) ?? input.phone }
    : input;
  const stored: Enrollment = {
    ...existingRaw,
    ...encryptedInput,
    pk: PK,
    sk: id,
    id,
    updatedAt: new Date().toISOString(),
  };
  await putItem(stored);
  return decryptItem(stored);
}

export async function deleteEnrollment(id: string) {
  await deleteItem(PK, id);
}
