// src/app/life-cycle/app-render-context/resolvers/primitives/datetime/datetime.primitive.resolver.app-render-context.ts

type DisplayDate = Readonly<{
  iso: string;
  label: string;
}>;

type Input = Readonly<{
  iso: string;
}>;

export const resolveDisplayDateAppRenderContext = ({
  iso,
}: Input): DisplayDate => {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return {
    iso,
    label: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
  };
};
