import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['incorporation-support', 'legal-support', 'accounting-support', 'banking-finance'], tags: ['company-formation', 'finance-operations'],
    description: 'a company-formation service that combines incorporation workflows with legal documents and access to tax, bookkeeping, or business-banking support',
    value: 'Company formation, standard legal documents, compliance guidance, and provider-specific finance or accounting services',
    rows: [
      ['stripe-atlas', 'Stripe', 'Stripe Atlas', 'https://stripe.com/atlas'],
      ['firstbase-start', 'Firstbase', 'Firstbase Start', 'https://www.firstbase.io/start'],
      ['doola-company-formation', 'doola', 'Company Formation and Compliance', 'https://www.doola.com/'],
      ['startglobal-company-formation', 'StartGlobal', 'US Company Formation', 'https://startglobal.co/'],
      ['clemta-company-formation', 'Clemta', 'US Company Formation', 'https://clemta.com/'],
      ['tailor-brands-llc-formation', 'Tailor Brands', 'LLC Formation', 'https://www.tailorbrands.com/llc-formation'],
      ['inc-authority-formation', 'Inc Authority', 'Business Formation', 'https://www.incauthority.com/'],
      ['swyft-filings-business-formation', 'Swyft Filings', 'Business Formation', 'https://www.swyftfilings.com/'],
      ['bizee-business-formation', 'Bizee', 'Business Formation', 'https://bizee.com/'],
      ['zenbusiness-formation', 'ZenBusiness', 'Business Formation', 'https://www.zenbusiness.com/'],
    ],
  },
  {
    subcategories: ['cloud-credits', 'infrastructure-credits'], tags: ['cloud', 'startup-credits'],
    description: 'an official startup cloud program offering eligible companies promotional infrastructure credits and technical or go-to-market support',
    value: 'Provider-specific cloud credits, technical guidance, architecture resources, and startup ecosystem support',
    rows: [
      ['aws-activate-cloud-credits', 'Amazon Web Services', 'AWS Activate', 'https://aws.amazon.com/startups/credits'],
      ['google-cloud-startup-program', 'Google Cloud', 'Google for Startups Cloud Program', 'https://cloud.google.com/startup'],
      ['oracle-for-startups-cloud', 'Oracle', 'Oracle for Startups', 'https://www.oracle.com/startup/'],
      ['digitalocean-hatch', 'DigitalOcean', 'Hatch Startup Program', 'https://www.digitalocean.com/hatch'],
      ['ovhcloud-startup-program', 'OVHcloud', 'OVHcloud Startup Program', 'https://startup.ovhcloud.com/'],
      ['scaleway-startup-program', 'Scaleway', 'Scaleway Startup Program', 'https://www.scaleway.com/en/startup-program/'],
      ['akamai-cloud-startup-program', 'Akamai', 'Akamai Cloud Rise Start-Up Program', 'https://www.akamai.com/cloud/start-ups/rise'],
      ['mongodb-for-startups', 'MongoDB', 'MongoDB for Startups', 'https://www.mongodb.com/solutions/startups'],
      ['alibaba-cloud-startup-catalyst', 'Alibaba Cloud', 'Startup Catalyst Program', 'https://www.alibabacloud.com/startup'],
    ],
  },
  {
    subcategories: ['marketing-tools', 'customer-support-tools', 'saas-discounts'], tags: ['customer-engagement', 'startup-discount'],
    description: 'an official startup program offering eligible early-stage companies discounted customer engagement, marketing, or support software',
    value: 'Time-limited software discounts, onboarding resources, and customer acquisition or support tooling',
    rows: [
      ['hubspot-for-startups', 'HubSpot', 'HubSpot for Startups', 'https://www.hubspot.com/startups'],
      ['freshworks-for-startups', 'Freshworks', 'Freshworks for Startups', 'https://www.freshworks.com/company/partners/home/partner-program-faq/faqs/'],
      ['zoho-for-startups', 'Zoho', 'Zoho for Startups', 'https://www.zoho.com/startups/'],
      ['intercom-early-stage', 'Intercom', 'Early Stage Program', 'https://www.intercom.com/early-stage'],
      ['brevo-for-startups', 'Brevo', 'Brevo for Startups', 'https://www.brevo.com/startups/'],
    ],
  },
  {
    subcategories: ['customer-support-tools', 'saas-discounts'], tags: ['customer-support', 'startup-discount'],
    description: 'an official startup offer providing eligible early-stage companies discounted customer service, help desk, or shared-inbox software',
    value: 'Customer-support software discounts, onboarding resources, and provider-specific service tooling',
    rows: [
      ['help-scout-for-startups', 'Help Scout', 'Help Scout for Startups', 'https://www.helpscout.com/startups/'],
      ['crisp-startup-program', 'Crisp', 'Crisp Startup Program', 'https://help.crisp.chat/en/article/how-to-apply-to-the-startup-program-lyfxt4/'],
      ['front-startup-program', 'Front', 'Front Startup Program', 'https://front.com/startups'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'startup-benefits', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Companies must meet the provider’s current stage, funding, age, geography, partner-referral, account, and program-specific requirements; ordinary fees may apply outside promotional benefits.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated startup support opportunities.`);
