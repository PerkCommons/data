import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface TaxonomySubcategory {
  id: string;
  label: string;
}

export interface TaxonomyCategory {
  id: string;
  label: string;
  description: string;
  subcategories: TaxonomySubcategory[];
}

export interface OpportunityTaxonomy {
  version: number;
  categories: TaxonomyCategory[];
  legacyCategoryAliases: Record<string, string>;
}

export async function loadTaxonomy(root: string): Promise<OpportunityTaxonomy> {
  return JSON.parse(
    await readFile(
      join(root, "taxonomy/opportunity-taxonomy.json"),
      "utf8",
    ),
  ) as OpportunityTaxonomy;
}

export function normalizeCategory(
  category: unknown,
  taxonomy: OpportunityTaxonomy,
): unknown {
  return typeof category === "string"
    ? (taxonomy.legacyCategoryAliases[category] ?? category)
    : category;
}

export function taxonomySelectionError(
  category: unknown,
  subcategories: unknown,
  taxonomy: OpportunityTaxonomy,
): string | null {
  if (typeof category !== "string") return "category must be a string";
  const definition = taxonomy.categories.find((item) => item.id === category);
  if (!definition) return `unknown category '${category}'`;
  if (subcategories === undefined) return null;
  if (!Array.isArray(subcategories)) return "subcategories must be an array";
  const allowed = new Set(definition.subcategories.map((item) => item.id));
  const invalid = subcategories.find(
    (item) => typeof item !== "string" || !allowed.has(item),
  );
  return invalid === undefined
    ? null
    : `subcategory '${String(invalid)}' does not belong to '${category}'`;
}
