// src/app/life-cycle/app-render/document/page/body/body.page.document.app-render.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { ContentBody } from "./body.page.document.app-render";
import { Module } from "./modules/module.body.page.document.app-render";

jest.mock("./modules/module.body.page.document.app-render", () => ({
  Module: jest.fn(({ module }: Parameters<typeof Module>[0]) => (
    <div data-module-kind={module.kind} />
  )),
}));

const mockedModule = jest.mocked(Module);

type Body = Parameters<typeof ContentBody>[0]["body"];
type BodyModule = Body["modules"][number];
type FooterModule = Body["footer"][number];

describe("ContentBody AppRender", () => {
  const createModule = (kind: BodyModule["kind"]): BodyModule =>
    ({ kind }) as BodyModule;

  const createFooterModule = (kind: FooterModule["kind"]): FooterModule =>
    ({ kind }) as FooterModule;

  const createBody = (overrides: Partial<Body> = {}): Body => ({
    modules: [],
    footer: [],
    ...overrides,
  });

  const renderBody = (body: Body): string =>
    renderToStaticMarkup(<ContentBody body={body} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main modules in their original order", () => {
    const first = createModule("hero");
    const second = createModule("richContent");

    const html = renderBody(
      createBody({
        modules: [first, second],
      }),
    );

    expect(html).toBe(
      '<div data-module-kind="hero"></div>' +
        '<div data-module-kind="richContent"></div>',
    );

    expect(mockedModule).toHaveBeenCalledTimes(2);
    expect(mockedModule.mock.calls[0]?.[0].module).toBe(first);
    expect(mockedModule.mock.calls[1]?.[0].module).toBe(second);
  });

  it("renders footer modules after main modules", () => {
    const main = createModule("richContent");
    const footer = createFooterModule("articleFooter");

    const html = renderBody(
      createBody({
        modules: [main],
        footer: [footer],
      }),
    );

    expect(html).toBe(
      '<div data-module-kind="richContent"></div>' +
        '<div data-module-kind="articleFooter"></div>',
    );

    expect(mockedModule).toHaveBeenCalledTimes(2);
    expect(mockedModule.mock.calls[0]?.[0].module).toBe(main);
    expect(mockedModule.mock.calls[1]?.[0].module).toBe(footer);
  });

  it("forwards the original module references", () => {
    const main = createModule("pageIntro");
    const footer = createFooterModule("articleFooter");

    renderBody(
      createBody({
        modules: [main],
        footer: [footer],
      }),
    );

    expect(mockedModule.mock.calls[0]?.[0]).toEqual({
      module: main,
    });

    expect(mockedModule.mock.calls[1]?.[0]).toEqual({
      module: footer,
    });
  });

  it("does not forward containment props", () => {
    renderBody(
      createBody({
        modules: [createModule("richContent")],
      }),
    );

    expect(mockedModule.mock.calls[0]?.[0]).toEqual({
      module: expect.any(Object),
    });

    expect(mockedModule.mock.calls[0]?.[0]).not.toHaveProperty("contained");
  });

  it("does not introduce an additional DOM wrapper", () => {
    const html = renderBody(
      createBody({
        modules: [createModule("hero"), createModule("richContent")],
      }),
    );

    expect(html).toBe(
      '<div data-module-kind="hero"></div>' +
        '<div data-module-kind="richContent"></div>',
    );
  });

  it("supports an empty body", () => {
    const html = renderBody(createBody());

    expect(html).toBe("");
    expect(mockedModule).not.toHaveBeenCalled();
  });

  it("supports footer modules without main modules", () => {
    const footer = createFooterModule("articleFooter");

    const html = renderBody(
      createBody({
        footer: [footer],
      }),
    );

    expect(html).toBe('<div data-module-kind="articleFooter"></div>');

    expect(mockedModule).toHaveBeenCalledTimes(1);
    expect(mockedModule.mock.calls[0]?.[0].module).toBe(footer);
  });

  it("supports main modules without footer modules", () => {
    const main = createModule("hero");

    const html = renderBody(
      createBody({
        modules: [main],
      }),
    );

    expect(html).toBe('<div data-module-kind="hero"></div>');

    expect(mockedModule).toHaveBeenCalledTimes(1);
    expect(mockedModule.mock.calls[0]?.[0].module).toBe(main);
  });

  it("does not mutate the supplied collections", () => {
    const modules = Object.freeze([createModule("hero")]);

    const footer = Object.freeze([createFooterModule("articleFooter")]);

    const body = createBody({ modules, footer });

    expect(() => renderBody(body)).not.toThrow();

    expect(body.modules).toHaveLength(1);
    expect(body.footer).toHaveLength(1);
  });
});
