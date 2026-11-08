// src/app/life-cycle/life-cycle.ts

import type { ValidatedEnv } from "../entry.type";

import { resolveInspectStage, inspectLifeCycle } from "./inspect/inspect";

import { handleRequest } from "./request/request";
import { createAppInit } from "./app-init/app-init";
import { handleResponse } from "./response/response";
import { handleRouting } from "./routing/routing";
import { handleSystem } from "./system/system";
import { createAppResolve } from "./app-resolve/app-resolve";
import { createAppRenderContext } from "./app-render-context/app-render-context";
import { appRender } from "./app-render/app-render";

type Input = Readonly<{
  request: Request;
  env: ValidatedEnv;
}>;

export const handleLifeCycle = async ({
  request,
  env,
}: Input): Promise<Response> => {
  const requestResult = handleRequest({ request, env });

  if (!requestResult.ok) {
    if (requestResult.reason === "REDIRECT") {
      return handleResponse({
        result: {
          kind: "redirect",
          status: requestResult.status,
          location: requestResult.location,
        },
      });
    }

    return handleResponse({ result: requestResult });
  }

  const inspectStage = resolveInspectStage({
    url: new URL(requestResult.request.url),
    enabled: env.INSPECT_ENABLED === "true",
  });

  const appInit = createAppInit({ env });

  if (inspectStage === "app-init") {
    return handleResponse({
      result: inspectLifeCycle({
        stage: "app-init",
        data: appInit.toInspectionSnapshot,
      }),
    });
  }

  const routingResult = await handleRouting({
    request: requestResult.request,
    env,
    appInit,
  });

  if (routingResult.kind === "system") {
    const systemResult = handleSystem({
      resolver: routingResult.resolver,
      appInit,
      ledger: routingResult.ledger,
    });

    return handleResponse({ result: systemResult });
  }

  if (routingResult.kind === "failure") {
    return handleResponse({
      result: {
        kind: "txt",
        status: routingResult.status,
        body: routingResult.message,
      },
    });
  }

  const appResolve = await createAppResolve({
    appInit,
    routing: routingResult,
    env,
  });

  if (inspectStage === "app-resolve") {
    return handleResponse({
      result: inspectLifeCycle({
        stage: "app-resolve",
        data: appResolve.toInspectionSnapshot,
      }),
    });
  }

  const appRenderContext = createAppRenderContext({
    appResolve,
  });

  if (inspectStage === "app-render-context") {
    return handleResponse({
      result: inspectLifeCycle({
        stage: "app-render-context",
        data: appRenderContext.toInspectionSnapshot,
      }),
    });
  }

  return handleResponse({
    result: appRender(appRenderContext),
  });
};
