import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  loadTaxonomy,
  normalizeCategory,
  taxonomySelectionError,
} from "../scripts/taxonomy";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const taxonomy = await loadTaxonomy(root);
const schema = JSON.parse(
  await readFile(join(root, "schema/opportunity.schema.json"), "utf8"),
);
const fixtures = JSON.parse(
  await readFile(
    join(root, "tests/fixtures/taxonomy-opportunities.json"),
    "utf8",
  ),
) as Array<Record<string, unknown>>;
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const base = fixtures[0];

test("all category identifiers and their subcategories validate", () => {
  assert.equal(taxonomy.categories.length, 20);
  for (const category of taxonomy.categories) {
    const opportunity = {
      ...base,
      id: `fixture-${category.id}`,
      category: category.id,
      subcategories: category.subcategories.slice(0, 1).map((item) => item.id),
    };
    assert.equal(validate(opportunity), true, ajv.errorsText(validate.errors));
    assert.equal(
      taxonomySelectionError(
        opportunity.category,
        opportunity.subcategories,
        taxonomy,
      ),
      null,
    );
  }
});

test("unknown and cross-category identifiers are rejected", () => {
  assert.equal(validate({ ...base, category: "coupons" }), false);
  assert.match(
    taxonomySelectionError(
      "student-benefits",
      ["cloud-credits"],
      taxonomy,
    ) ?? "",
    /does not belong/,
  );
});

test("legacy categories normalize without changing opportunity IDs", () => {
  assert.equal(normalizeCategory("cloud-credits", taxonomy), "startup-benefits");
  assert.equal(normalizeCategory("grants", taxonomy), "funding");
  assert.equal(normalizeCategory("student-benefits", taxonomy), "student-benefits");
});

test("representative fixture opportunities are schema-valid", () => {
  assert.equal(fixtures.length, 12);
  for (const fixture of fixtures) {
    assert.equal(validate(fixture), true, ajv.errorsText(validate.errors));
    assert.equal(
      taxonomySelectionError(
        fixture.category,
        fixture.subcategories,
        taxonomy,
      ),
      null,
    );
  }
});
