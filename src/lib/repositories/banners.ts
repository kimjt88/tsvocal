import "server-only";

import { deleteItem, getItem, listByPk, newId, putItem } from "./_base";

const PK = "BANNER";

export type Banner = {
  pk: string;
  sk: string;
  id: string;
  title: string;
  subtitle?: string;
  imageKey?: string;
  ctaLabel?: string;
  ctaHref?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listBanners() {
  const items = await listByPk<Banner>(PK);
  return items.sort((a, b) => a.order - b.order);
}

export async function getBanner(id: string) {
  return getItem<Banner>(PK, id);
}

export type BannerInput = Omit<
  Banner,
  "pk" | "sk" | "id" | "createdAt" | "updatedAt"
>;

export async function createBanner(input: BannerInput) {
  const now = new Date().toISOString();
  const id = newId();
  const item: Banner = { ...input, pk: PK, sk: id, id, createdAt: now, updatedAt: now };
  await putItem(item);
  return item;
}

export async function updateBanner(id: string, input: BannerInput) {
  const existing = await getBanner(id);
  if (!existing) throw new Error("not_found");
  const item: Banner = {
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

export async function deleteBanner(id: string) {
  await deleteItem(PK, id);
}
