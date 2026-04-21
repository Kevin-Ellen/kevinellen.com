// tests/src/app-context/resolve/page/content/block/pre.resolve.app-context.test.ts

import { appContextResolvePreBlockContentModule } from "@app-context/resolve/page/content/block/pre.resolve.app-context";

describe("appContextResolvePreBlockContentModule", () => {
  it("returns the pre module unchanged", () => {
    const module = {
      kind: "pre",
      value: "hello-world",
    } as const;

    const result = appContextResolvePreBlockContentModule(module, {} as never);

    expect(result).toBe(module);
  });
});
