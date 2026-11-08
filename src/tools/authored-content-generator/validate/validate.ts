// src/tools/authored-content-generator/validate/validate.ts

import { mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import Ajv, { type ValidateFunction } from "ajv";

import { validatePhoto } from "./photo/photo.validate";
import { validateJournal } from "./journal/journal.validate";
import { importAuthored } from "./import-authored.validate";

type JsonSchema = Record<string, unknown>;
type ValidatedPhoto = ReturnType<typeof validatePhoto>;

const createSchemaValidator = (
  schema: JsonSchema,
  definition: string,
): ValidateFunction => {
  const ajv = new Ajv({ allErrors: true });

  return ajv.compile({
    ...schema,
    $ref: `#/definitions/${definition}`,
  });
};

const getPhotoIds = (journal: unknown): readonly string[] => {
  if (
    typeof journal !== "object" ||
    journal === null ||
    !("photos" in journal) ||
    !Array.isArray(journal.photos) ||
    !journal.photos.every((id: unknown) => typeof id === "string")
  ) {
    throw new Error("Journal requires a valid photograph inventory");
  }

  return journal.photos;
};

const writeJson = async (filePath: string, value: unknown): Promise<void> => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const main = async (): Promise<void> => {
  const workspace = process.argv[2];

  if (
    !workspace ||
    workspace === "." ||
    workspace === ".." ||
    basename(workspace) !== workspace
  ) {
    throw new Error("Valid journal workspace argument is required");
  }

  const directory = resolve(
    process.cwd(),
    "authored-content",
    "journals",
    workspace,
  );

  const artifactsDirectory = resolve(directory, "artifacts");

  // Invalidate artifacts from any previous validation run.
  await rm(artifactsDirectory, {
    recursive: true,
    force: true,
  });

  const schemaPath = resolve(process.cwd(), "schema", "authored.schema.json");

  const schema = JSON.parse(await readFile(schemaPath, "utf8")) as JsonSchema;

  const validatePhotoSchema = createSchemaValidator(
    schema,
    "PhotoAssetAuthored",
  );

  const validateJournalSchema = createSchemaValidator(
    schema,
    "ContentAuthored",
  );

  const journal = await importAuthored(
    resolve(directory, "journal.ts"),
    "journal",
  );

  const photoIds = getPhotoIds(journal);
  const photos: ValidatedPhoto[] = [];

  for (const id of photoIds) {
    if (
      !id ||
      id === "." ||
      id === ".." ||
      basename(id) !== id ||
      id.includes("/") ||
      id.includes("\\")
    ) {
      throw new Error(`Invalid photograph ID: "${id}"`);
    }

    const photo = await importAuthored(resolve(directory, `${id}.ts`), "photo");

    photos.push(
      validatePhoto({
        photo,
        expectedId: id,
        validateSchema: validatePhotoSchema,
      }),
    );
  }

  const validated = validateJournal({
    journal,
    photos,
    validateSchema: validateJournalSchema,
  });

  // Only create artifacts after all validation has passed.
  const stagingDirectory = await mkdtemp(resolve(directory, ".artifacts-"));

  try {
    await Promise.all([
      writeJson(
        resolve(stagingDirectory, "journal.authored.json"),
        validated.authored,
      ),
      writeJson(
        resolve(stagingDirectory, "journal.app-init.json"),
        validated.appInit,
      ),
      ...photos.flatMap(({ authored, appInit }) => [
        writeJson(
          resolve(stagingDirectory, `${authored.id}.authored.json`),
          authored,
        ),
        writeJson(
          resolve(stagingDirectory, `${authored.id}.app-init.json`),
          appInit,
        ),
      ]),
    ]);

    await rename(stagingDirectory, artifactsDirectory);
  } catch (error) {
    await rm(stagingDirectory, {
      recursive: true,
      force: true,
    });

    throw error;
  }

  console.log(`✓ Publication artifacts created: ${artifactsDirectory}`);
  console.log(`  Journal: ${validated.authored.id}`);
  console.log(`  Photos: ${photos.length}`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
