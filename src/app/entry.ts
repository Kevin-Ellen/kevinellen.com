// src/app/entry.ts

import type { ValidatedEnv, WorkerEnv } from "./entry.type";

import { handleLifeCycle } from "./life-cycle/life-cycle";
import { handleMediaSystem } from "./life-cycle/system/media/media.system";

const assertWorkerEnv: (env: WorkerEnv) => asserts env is ValidatedEnv = (
  env,
) => {
  if (!env.CONTENT_KV) {
    throw new Error("Missing required binding: CONTENT_KV");
  }

  if (!env.PHOTO_KV) {
    throw new Error("Missing required binding: PHOTO_KV");
  }
};

export default {
  fetch: async (
    request: Request,
    env: WorkerEnv,
    ctx: ExecutionContext,
  ): Promise<Response> => {
    try {
      assertWorkerEnv(env);

      const mediaResponse = await handleMediaSystem({
        request,
        imagesAccountHash: env.IMAGES_ACCOUNT_HASH,
        ctx,
      });

      if (mediaResponse !== null) {
        return mediaResponse;
      }

      return await handleLifeCycle({ request, env });
    } catch (error: unknown) {
      console.error("Worker request failed", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
              }
            : {
                name: "UnknownError",
              },
      });

      return new Response("Internal Server Error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
  },
} satisfies ExportedHandler<WorkerEnv>;
