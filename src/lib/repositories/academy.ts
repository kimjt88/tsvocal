import "server-only";

import { getItem, putItem, SINGLETON_SK } from "./_base";

const PK = "ACADEMY";

export type Academy = {
  pk: string;
  sk: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  hours: string;
  email?: string;
  naverCafeUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  mapEmbedUrl?: string;
  mapKakaoRoughKey?: string;
  mapKakaoRoughTimestamp?: string;
  registrationNumber?: string;
  representativeName?: string;
  businessNumber?: string;
  updatedAt: string;
};

export async function getAcademy() {
  return getItem<Academy>(PK, SINGLETON_SK);
}

export async function saveAcademy(input: Omit<Academy, "pk" | "sk" | "updatedAt">) {
  const item: Academy = {
    ...input,
    pk: PK,
    sk: SINGLETON_SK,
    updatedAt: new Date().toISOString(),
  };
  await putItem(item);
  return item;
}
