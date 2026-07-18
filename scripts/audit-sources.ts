import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const categoryIndex = process.argv.indexOf("--category");
const requestedCategory =
  categoryIndex >= 0 ? process.argv[categoryIndex + 1] : undefined;
const candidateFiles = (await readdir(join(root, "opportunities"))).filter(
  (name) => name.endsWith(".json") && !name.startsWith("_"),
);
const files: string[] = [];
for (const file of candidateFiles) {
  const opportunity = JSON.parse(
    await readFile(join(root, "opportunities", file), "utf8"),
  ) as { category?: string };
  if (!requestedCategory || opportunity.category === requestedCategory) {
    files.push(file);
  }
}
if (requestedCategory && files.length === 0) {
  throw new Error(`No opportunities found for category ${requestedCategory}.`);
}
const queue = files.slice();
const failures: string[] = [];
const blocked: string[] = [];

async function audit(file: string) {
  const opportunity = JSON.parse(
    await readFile(join(root, "opportunities", file), "utf8"),
  ) as { sourceUrl: string; officialUrl: string };
  const urls = Object.entries({
    sourceUrl: opportunity.sourceUrl,
    officialUrl: opportunity.officialUrl,
  }).filter(([, url], index, entries) =>
    entries.findIndex(([, candidate]) => candidate === url) === index,
  );
  for (const [field, url] of urls) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "user-agent": "PerkCommons source audit/1.0" },
      });
      if (
        response.status === 401 ||
        response.status === 403 ||
        response.status === 429
      ) {
        blocked.push(`${file} ${field}: HTTP ${response.status} ${url}`);
      } else if (response.status >= 400) {
        failures.push(`${file} ${field}: HTTP ${response.status} ${url}`);
      }
      await response.body?.cancel();
    } catch (error) {
      failures.push(`${file} ${field}: ${String(error)} ${url}`);
    }
  }
}

await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length > 0) {
      const file = queue.shift();
      if (file) await audit(file);
    }
  }),
);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
if (blocked.length > 0) {
  console.warn(
    `${blocked.length} URLs blocked automated access and require browser review:\n${blocked.join("\n")}`,
  );
}
console.log(`Verified source and official URLs for ${files.length} opportunities.`);
