// tests/src/app-context/resolve/navigation/navigation.resolve.app-context.test.ts

import { resolveNavigationAppContext } from "@app-context/resolve/navigation/navigation.resolve.app-context";
import { resolveHeaderNavigationAppContext } from "@app-context/resolve/navigation/header.navigation.resolve.app-context";
import { resolveFooterNavigationAppContext } from "@app-context/resolve/navigation/footer.navigation.resolve.app-context";

jest.mock(
  "@app-context/resolve/navigation/header.navigation.resolve.app-context",
  () => ({
    resolveHeaderNavigationAppContext: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/navigation/footer.navigation.resolve.app-context",
  () => ({
    resolveFooterNavigationAppContext: jest.fn(),
  }),
);

describe("resolveNavigationAppContext", () => {
  const mockedResolveHeaderNavigationAppContext = jest.mocked(
    resolveHeaderNavigationAppContext,
  );
  const mockedResolveFooterNavigationAppContext = jest.mocked(
    resolveFooterNavigationAppContext,
  );

  const appState = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves header and footer navigation and combines them", () => {
    mockedResolveHeaderNavigationAppContext.mockReturnValue({
      primary: [],
      social: [],
    });

    mockedResolveFooterNavigationAppContext.mockReturnValue({
      sections: [],
    });

    const navigation = {
      header: {
        primary: [],
        social: [],
      },
      footer: {
        sections: [],
      },
    } as const;

    const result = resolveNavigationAppContext(navigation, appState);

    expect(result).toEqual({
      header: {
        primary: [],
        social: [],
      },
      footer: {
        sections: [],
      },
    });

    expect(mockedResolveHeaderNavigationAppContext).toHaveBeenCalledWith(
      navigation.header,
      appState,
    );
    expect(mockedResolveFooterNavigationAppContext).toHaveBeenCalledWith(
      navigation.footer,
      appState,
    );
  });
});
