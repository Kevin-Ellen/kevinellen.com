// packages/content-cli/src/cli/content.cli.ts

import dotenv from "dotenv";
import { runCli } from "@content-cli/cli/run.cli";

dotenv.config();

void runCli(process.argv.slice(2));
