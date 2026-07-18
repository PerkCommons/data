import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogUrl = "https://startups.aws.com/offers?lang=en-US";
const html = await fetch(catalogUrl).then((response) => {
  if (!response.ok) throw new Error(`AWS offer catalog returned ${response.status}`);
  return response.text();
});

const decode = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;|—/g, "-")
    .replace(/&trade;|Γäó/g, "")
    .replace(/\s+/g, " ")
    .trim();
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const fit = (value: string, max: number) =>
  value.length <= max
    ? value
    : `${value.slice(0, max - 3).replace(/\s+\S*$/, "")}...`;

const excluded = new Set([
  "amazon-device-",
  "amazon-one-medical",
  "amazonbusiness",
  "pega-5k",
  "pega-10k",
  "pega-25k-new",
]);
const customerSupport = new Set(["ada-aeo", "devrev", "intercom", "zendesk", "hubspot"]);
const marketing = new Set(["amplitude", "bright-data", "framer", "hubspot", "miro", "qdrant"]);
const finance = new Set(["atlas", "deel", "mercury", "stripe"]);
const incorporation = new Set(["atlas", "deel"]);
const seen = new Set<string>();
let written = 0;

for (const match of html.matchAll(/<a data-testid="card-link"([\s\S]*?)<\/article><\/a>/g)) {
  const card = match[0];
  const path = card.match(/href="\/offers\/([^"]+)"/)?.[1];
  if (!path || excluded.has(path) || seen.has(path)) continue;
  seen.add(path);
  const provider = decode(card.match(/data-vendor="([^"]*)"/)?.[1] ?? "");
  const title = decode(card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? "");
  const tags = [...card.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((item) =>
    decode(item[1]),
  );
  const description = decode(
    card.match(/<(?:p|div)[^>]*(?:description-p|description-rte)[^>]*>([\s\S]*?)(?:<\/p>|<\/div>)/)?.[1] ?? "",
  );
  if (!provider || !title || description.length < 40) continue;

  const search = `${title} ${description} ${tags.join(" ")}`.toLowerCase();
  const subcategories = new Set<string>(["saas-discounts"]);
  if (/cloud|compute|database|container|infrastructure|devops|api|hosting/.test(search)) {
    subcategories.add("infrastructure-credits");
  }
  if (/engineering|devops|developer|code|api|database|ci\/cd|product development/.test(search)) {
    subcategories.add("developer-tooling");
  }
  if (/analytics|observability|metrics|logs|insights|monitoring/.test(search)) {
    subcategories.add("analytics-observability");
  }
  if (/security|compliance|identity|authentication|vulnerability|waf|firewall/.test(search)) {
    subcategories.add("security-tools");
  }
  if (finance.has(path)) subcategories.add("banking-finance");
  if (incorporation.has(path)) subcategories.add("incorporation-support");
  if (marketing.has(path)) subcategories.add("marketing-tools");
  if (customerSupport.has(path)) subcategories.add("customer-support-tools");

  const id = `aws-activate-${slugify(path)}`;
  const sourceUrl = `https://startups.aws.com/offers/${path}`;
  const opportunity = {
    id,
    provider,
    title: fit(title, 140),
    category: "startup-benefits",
    subcategories: [...subcategories],
    tags: [...new Set(["aws-activate", "startups", ...tags.map(slugify).filter(Boolean)])].slice(0, 12),
    description: description.slice(0, 500),
    eligibility: "AWS Activate members who meet the offer's current provider, account, and regional requirements.",
    value: fit(title, 200),
    sourceUrl,
    officialUrl: sourceUrl,
    status: "limited",
    submissionType: "maintainer",
    sponsor: false,
    reviewDate: "2026-07-18",
    regions: ["Global"],
  };
  await writeFile(
    join(root, "opportunities", `${id}.json`),
    `${JSON.stringify(opportunity, null, 2)}\n`,
  );
  written += 1;
}

console.log(`Imported ${written} current AWS Activate partner offers.`);
