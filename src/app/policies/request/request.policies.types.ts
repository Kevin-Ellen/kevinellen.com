// src/app/policies/request/request.policies.types.ts

import type { PageDefinition } from "@app/pages/page.definition";
import type { ErrorRenderIntent } from "@app/request/request.types";

export type RequestPolicyOutcome =
  | {
      type: "direct-response";
      response: Response;
    }
  | {
      type: "render-page";
      page: PageDefinition;
      status: 200;
    }
  | {
      type: "render-error";
      intent: ErrorRenderIntent;
    };
