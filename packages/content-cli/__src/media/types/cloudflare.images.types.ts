// packages/content-pipeline/src/media/types/cloudflare.images.types.ts

export type CloudflareImageUploadResult = {
  id: string;
  filename: string;
  uploaded: string;
  variants: string[];
};

export type CloudflareImageUploadError = {
  code: number;
  message: string;
};

export type CloudflareImageUploadResponse =
  | {
      success: true;
      errors: [];
      messages: unknown[];
      result: CloudflareImageUploadResult;
    }
  | {
      success: false;
      errors: CloudflareImageUploadError[];
      messages: unknown[];
      result: null;
    };
