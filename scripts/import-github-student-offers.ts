import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogUrl = "https://education.github.com/pack?sort=az";
const html = await fetch(catalogUrl).then((response) => {
  if (!response.ok) throw new Error(`GitHub Education returned ${response.status}`);
  return response.text();
});
const decode = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fit = (value: string, max: number) =>
  value.length <= max
    ? value
    : `${value.slice(0, max - 3).replace(/\s+\S*$/, "")}...`;
const excluded = new Set(["github", "notion"]);
let written = 0;

for (const match of html.matchAll(/<div class="pack-offer-card[^>]*>([\s\S]*?)(?=<div class="pack-offer-card|<\/div>\s*<\/div>\s*<\/div>)/g)) {
  const card = match[0];
  const id = card.match(/<h3 id="([^"]+)"/)?.[1];
  const provider = decode(card.match(/<h3[^>]*class="sr-only"[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? "");
  const paragraphs = [...card.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((item) => decode(item[1]));
  const description = paragraphs[0] ?? "";
  const offer = paragraphs[1] ?? "";
  const tags = [...card.matchAll(/class="Label"[^>]*>([\s\S]*?)<\/span>/g)].map((item) => decode(item[1]));
  if (!id || excluded.has(id) || !provider || description.length < 20 || offer.length < 2) continue;

  const search = `${provider} ${description} ${offer} ${tags.join(" ")}`.toLowerCase();
  const subcategories = new Set<string>(["student-developer-packs"]);
  if (/developer tools|productivity|design|security|cloud|infrastructure|mobile|internet of things/.test(search)) {
    subcategories.add("software-discounts");
  }
  if (/while you are a student|student account|student plan|education plan|student subscription/.test(search)) {
    subcategories.add("education-plans");
  }
  if (/learn|course|tutorial|lesson|training/.test(search)) {
    subcategories.add("free-courses");
    subcategories.add("academic-resources");
  }
  if (/certification|exam voucher|exam discount/.test(search)) {
    subcategories.add("certification-discounts");
  }
  if (/hardware|device|electronics|raspberry|arduino/.test(search)) {
    subcategories.add("hardware-discounts");
  }
  if (/subscription|membership|community/.test(search)) {
    subcategories.add("student-memberships");
  }

  const recordId = `github-student-pack-${slugify(id)}`;
  const sourceUrl = `https://education.github.com/pack#${id}`;
  const opportunity = {
    id: recordId,
    provider,
    title: fit(`${provider} Student Developer Pack Offer`, 140),
    category: "student-benefits",
    subcategories: [...subcategories],
    tags: [...new Set(["github-education", "students", ...tags.map(slugify).filter(Boolean)])].slice(0, 12),
    description: fit(description, 500),
    eligibility: "Verified students aged 13 or older who are approved for the GitHub Student Developer Pack; provider restrictions may also apply.",
    value: fit(offer, 200),
    sourceUrl,
    officialUrl: sourceUrl,
    status: "limited",
    submissionType: "maintainer",
    sponsor: false,
    reviewDate: "2026-07-18",
    regions: ["Global"],
  };
  await writeFile(
    join(root, "opportunities", `${recordId}.json`),
    `${JSON.stringify(opportunity, null, 2)}\n`,
  );
  written += 1;
}

console.log(`Imported ${written} current GitHub Student Developer Pack offers.`);
