import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(await readFile(join(root, "schema/listing.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const files = (await readdir(join(root, "listings"))).filter((name) => name.endsWith(".json") && !name.startsWith("_"));
const ids = new Set<string>();
let failed = false;
// Accept today's date in every civil timezone while still rejecting true future dates.
const latestCivilDate = new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString().slice(0, 10);

for (const file of files) {
  const listing = JSON.parse(await readFile(join(root, "listings", file), "utf8"));
  if (!validate(listing)) {
    failed = true;
    console.error(`${file}: ${ajv.errorsText(validate.errors, { separator: "\n  " })}`);
  }
  if (listing.id !== file.replace(/\.json$/, "")) {
    failed = true;
    console.error(`${file}: filename must match id '${listing.id}'`);
  }
  if (ids.has(listing.id)) {
    failed = true;
    console.error(`${file}: duplicate id '${listing.id}'`);
  }
  ids.add(listing.id);
  if (listing.reviewDate > latestCivilDate) {
    failed = true;
    console.error(`${file}: reviewDate cannot be in the future`);
  }
}

if (files.length === 0) {
  throw new Error("The dataset must contain at least one published listing.");
}
if (failed) process.exit(1);
console.log(`Validated ${files.length} listings.`);
