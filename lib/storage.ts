import { del, head, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { runtimeEnv } from "@/lib/runtime-env";

const extensions = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" } as const;
export type MediaExtension = keyof typeof extensions;

// IDs are text in the current schema. New projects use UUIDs; existing seeded
// projects may have a short slug-based ID, which remains valid after migration.
export function validProjectId(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,79}$/i.test(value);
}

function token(): string {
  const value = runtimeEnv().BLOB_READ_WRITE_TOKEN?.trim();
  if (!value) throw new Error("BLOB_READ_WRITE_TOKEN is not configured on the server");
  return value;
}

export function isManagedBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") &&
      /^\/projects\/[a-z0-9][a-z0-9-]{0,79}\/[a-f0-9-]{36}\.(png|jpg|webp)$/.test(url.pathname);
  } catch {
    return false;
  }
}

export const mediaStorage = {
  async upload(projectId: string, data: Uint8Array, extension: MediaExtension): Promise<string> {
    if (!validProjectId(projectId) || !extensions[extension]) throw new Error("Invalid media target");
    const pathname = `projects/${projectId}/${randomUUID()}.${extension}`;
    const blob = await put(pathname, Buffer.from(data), {
      access: "public",
      contentType: extensions[extension],
      addRandomSuffix: false,
      token: token(),
    });
    return blob.url;
  },
  async remove(url: string): Promise<void> {
    if (!isManagedBlobUrl(url)) return; // Git assets and legacy URLs are not ours to delete.
    await del(url, { token: token() });
  },
  async legacyUrl(key: string): Promise<string | null> {
    if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/i.test(key)) return null;
    try {
      // An optional one-time import of old /media keys can use legacy/<key>.
      const blob = await head(`legacy/${key}`, { token: token() });
      return blob.url;
    } catch {
      return null;
    }
  },
};
