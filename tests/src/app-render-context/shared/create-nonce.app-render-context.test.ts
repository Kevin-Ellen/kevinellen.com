// tests/src/app-render-context/shared/create-nonce.app-render-context.test.ts

import { createNonceAppRenderContext } from "@app-render-context/shared/create-nonce.app-render-context";

describe("createNonceAppRenderContext", () => {
  it("returns a 32 character hexadecimal nonce", () => {
    const nonce = createNonceAppRenderContext();

    expect(typeof nonce).toBe("string");
    expect(nonce).toHaveLength(32);
    expect(nonce).toMatch(/^[a-f0-9]{32}$/);
  });

  it("returns different values across multiple calls", () => {
    const first = createNonceAppRenderContext();
    const second = createNonceAppRenderContext();

    expect(first).not.toBe(second);
  });

  it("uses crypto.getRandomValues with a 16 byte Uint8Array", () => {
    const spy = jest.spyOn(globalThis.crypto, "getRandomValues");

    createNonceAppRenderContext();

    expect(spy).toHaveBeenCalledTimes(1);

    const argument = spy.mock.calls[0][0];

    expect(argument).toBeInstanceOf(Uint8Array);
    expect(argument).toHaveLength(16);

    spy.mockRestore();
  });

  it("correctly pads single digit hex values", () => {
    const mockBytes = new Uint8Array([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);

    const spy = jest
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation((array) => {
        const typedArray = array as Uint8Array;

        typedArray.set(mockBytes);

        return array;
      });

    const nonce = createNonceAppRenderContext();

    expect(nonce).toBe("0102030405060708090a0b0c0d0e0f10");

    spy.mockRestore();
  });
});
