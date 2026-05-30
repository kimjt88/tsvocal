import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "REVIEW";

export type Review = {
  pk: string;
  sk: string;
  id: string;
  studentName: string;
  studentInfo?: string;
  rating: number;
  body: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listReviews() {
  const items = await listByPk<Review>(PK);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getReview(id: string) {
  return getItem<Review>(PK, id);
}

export type ReviewInput = Omit<Review, "pk" | "sk" | "id" | "createdAt" | "updatedAt">;

export async function createReview(input: ReviewInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: Review = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateReview(id: string, input: ReviewInput) {
  const existing = await getReview(id);
  if (!existing) throw new Error("not_found");
  const item: Review = {
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

export async function deleteReview(id: string) {
  await deleteItem(PK, id);
}
