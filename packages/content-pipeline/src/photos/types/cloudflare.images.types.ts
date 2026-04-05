// packages/content-pipeline/src/photos/types/cloudflare.images.types.ts

export type CloudflareImageUploadResult = {
  id: string;
  filename: string | null;
  uploaded: string | null;
  variants: string[];
};

type CloudflareApiSuccessEnvelope<T> = {
  success: true;
  errors: [];
  messages: unknown[];
  result: T;
};

type CloudflareApiErrorEnvelope = {
  success: false;
  errors: Array<{
    code?: number;
    message?: string;
  }>;
  messages: unknown[];
  result?: unknown;
};

export type CloudflareImageUploadResponse =
  | CloudflareApiSuccessEnvelope<CloudflareImageUploadResult>
  | CloudflareApiErrorEnvelope;
