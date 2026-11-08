// src/app/life-cycle/inspect/inspect.ts

type InspectStage =
  | "app-init"
  | "routing"
  | "app-resolve"
  | "app-render-context";

type InspectOutput = Readonly<{
  kind: "json";
  body: string;
  status: number;
}>;

type InspectLifeCycleInput = Readonly<{
  stage: InspectStage;
  data: unknown;
}>;

type ResolveInspectStageInput = Readonly<{
  url: URL;
  enabled: boolean;
}>;

const INSPECT_STAGES = [
  "app-init",
  "routing",
  "app-resolve",
  "app-render-context",
] as const satisfies readonly InspectStage[];

export const resolveInspectStage = ({
  url,
  enabled,
}: ResolveInspectStageInput): InspectStage | null => {
  if (!enabled) return null;

  const stage = url.searchParams.get("__inspect");

  return INSPECT_STAGES.find((value) => value === stage) ?? null;
};

export const inspectLifeCycle = ({
  stage,
  data,
}: InspectLifeCycleInput): InspectOutput => ({
  kind: "json",
  status: 200,
  body: JSON.stringify({ stage, data }, null, 2),
});
