import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['professional-software', 'design-tools'], tags: ['design', 'free-plan'],
    description: 'a no-cost plan or open professional design tool available under its published terms',
    value: 'Professional design capabilities without a required paid subscription',
    rows: [
      ['figma-starter-plan', 'Figma', 'Starter Plan', 'https://www.figma.com/pricing/'],
      ['canva-free-plan', 'Canva', 'Canva Free', 'https://www.canva.com/pricing/'],
      ['adobe-express-free', 'Adobe', 'Adobe Express Free', 'https://www.adobe.com/express/pricing'],
      ['penpot-free', 'Penpot', 'Penpot Free Design Platform', 'https://penpot.app/pricing'],
      ['photopea-free-editor', 'Photopea', 'Free Online Photo Editor', 'https://www.photopea.com/'],
      ['davinci-resolve-free', 'Blackmagic Design', 'DaVinci Resolve Free', 'https://www.blackmagicdesign.com/products/davinciresolve'],
      ['blender-free', 'Blender Foundation', 'Blender', 'https://www.blender.org/'],
      ['inkscape-free', 'Inkscape Project', 'Inkscape', 'https://inkscape.org/'],
      ['krita-free', 'Krita Foundation', 'Krita', 'https://krita.org/'],
      ['lunacy-free-design', 'Icons8', 'Lunacy', 'https://icons8.com/lunacy'],
    ],
  },
  {
    subcategories: ['professional-software', 'productivity-tools', 'communications-tools'], tags: ['productivity', 'free-plan'],
    description: 'a generally available free plan for professional productivity or communication',
    value: 'Core collaboration, organization, or communication features without a required paid subscription',
    rows: [
      ['notion-free-plan', 'Notion', 'Free Plan', 'https://www.notion.com/pricing'],
      ['slack-free-plan', 'Slack', 'Free Plan', 'https://slack.com/pricing/free'],
      ['zoom-basic-plan', 'Zoom', 'Basic Plan', 'https://www.zoom.com/en/products/virtual-meetings/'],
      ['miro-free-plan', 'Miro', 'Free Plan', 'https://miro.com/pricing/'],
      ['airtable-free-plan', 'Airtable', 'Free Plan', 'https://www.airtable.com/pricing'],
      ['clickup-free-plan', 'ClickUp', 'Free Forever Plan', 'https://clickup.com/pricing'],
      ['todoist-free-plan', 'Todoist', 'Beginner Plan', 'https://www.todoist.com/pricing'],
      ['trello-free-plan', 'Atlassian', 'Trello Free', 'https://trello.com/pricing'],
      ['asana-personal-plan', 'Asana', 'Personal Plan', 'https://asana.com/pricing'],
      ['loom-starter-plan', 'Loom', 'Starter Plan', 'https://www.loom.com/pricing'],
    ],
  },
  {
    subcategories: ['hosting'], tags: ['hosting', 'free-tier'],
    description: 'a generally available no-cost hosting tier for eligible personal or development use',
    value: 'Static, application, or cloud hosting within published free-tier limits',
    rows: [
      ['netlify-free-plan', 'Netlify', 'Free Plan', 'https://www.netlify.com/pricing/'],
      ['vercel-hobby-plan', 'Vercel', 'Hobby Plan', 'https://vercel.com/pricing'],
      ['render-free-services', 'Render', 'Free Services', 'https://render.com/docs/free'],
      ['firebase-spark-plan', 'Google Firebase', 'Spark Plan', 'https://firebase.google.com/pricing'],
      ['gitlab-pages-free', 'GitLab', 'GitLab Pages', 'https://docs.gitlab.com/user/project/pages/'],
      ['surge-static-hosting', 'Surge', 'Free Static Web Publishing', 'https://surge.sh/'],
      ['neocities-free-plan', 'Neocities', 'Free Web Hosting', 'https://neocities.org/'],
      ['cloudflare-pages-free', 'Cloudflare', 'Pages Free Plan', 'https://pages.cloudflare.com/'],
      ['oracle-cloud-free-tier', 'Oracle Cloud', 'Free Tier', 'https://www.oracle.com/cloud/free/'],
      ['pythonanywhere-free-account', 'PythonAnywhere', 'Beginner Account', 'https://www.pythonanywhere.com/pricing/'],
    ],
  },
  {
    subcategories: ['hardware', 'memberships'], tags: ['rewards', 'hardware'],
    description: 'a free rewards membership that can provide published savings or rewards on eligible hardware purchases',
    value: 'Member pricing, reward points, delivery benefits, or hardware-purchase savings under current terms',
    rows: [
      ['dell-rewards', 'Dell', 'Dell Rewards', 'https://www.dell.com/en-us/lp/dell-rewards-program'],
      ['hp-rewards', 'HP', 'HP Rewards', 'https://www.hp.com/us-en/shop/cv/hp-rewards'],
      ['lenovo-rewards', 'Lenovo', 'My Lenovo Rewards', 'https://www.lenovo.com/us/en/rewards/'],
      ['samsung-rewards', 'Samsung', 'Samsung Rewards', 'https://www.samsung.com/us/rewards/'],
      ['my-best-buy', 'Best Buy', 'My Best Buy Memberships', 'https://www.bestbuy.com/site/membership/my-best-buy/pcmcat309300050007.c'],
      ['microsoft-rewards', 'Microsoft', 'Microsoft Rewards', 'https://www.microsoft.com/en-us/rewards/about'],
      ['office-depot-rewards', 'Office Depot', 'Office Depot OfficeMax Rewards', 'https://www.officedepot.com/l/rewards'],
      ['aubuchon-hardware-membership', 'Aubuchon Hardware', 'HardwareStore.com Membership', 'https://www.hardwarestore.com/membership'],
      ['autozone-rewards', 'AutoZone', 'AutoZone Rewards', 'https://www.autozone.com/rewards'],
      ['micro-center-insider', 'Micro Center', 'Insider Card Benefits', 'https://www.microcenter.com/site/content/mcinsidercard.aspx'],
    ],
  },
  {
    subcategories: ['travel-coworking', 'memberships'], tags: ['travel', 'loyalty'],
    description: 'a free travel loyalty membership with member rates or stay-related benefits',
    value: 'Member rates, points, upgrades, or other travel benefits under current program terms',
    rows: [
      ['marriott-bonvoy', 'Marriott International', 'Marriott Bonvoy', 'https://www.marriott.com/loyalty.mi'],
      ['hilton-honors', 'Hilton', 'Hilton Honors', 'https://www.hilton.com/en/hilton-honors/'],
      ['ihg-one-rewards', 'IHG Hotels & Resorts', 'IHG One Rewards', 'https://www.ihg.com/onerewards/content/us/en/home'],
      ['world-of-hyatt', 'Hyatt', 'World of Hyatt', 'https://world.hyatt.com/content/gp/en/home.html'],
      ['wyndham-rewards', 'Wyndham Hotels & Resorts', 'Wyndham Rewards', 'https://www.wyndhamhotels.com/wyndham-rewards'],
      ['radisson-rewards', 'Radisson Hotels', 'Radisson Rewards', 'https://www.radissonhotels.com/en-us/rewards'],
      ['accor-live-limitless', 'Accor', 'ALL - Accor Live Limitless', 'https://all.accor.com/loyalty-program/reasonstojoin/index.en.shtml'],
      ['choice-privileges', 'Choice Hotels', 'Choice Privileges', 'https://www.choicehotels.com/choice-privileges'],
      ['best-western-rewards', 'Best Western', 'Best Western Rewards', 'https://www.bestwestern.com/en_US/hotels/destinations/united-states/learn/bwr.html'],
      ['expedia-one-key', 'Expedia Group', 'One Key', 'https://www.expedia.com/welcome-one-key'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'discounts-perks', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Users must meet the current account, location, use, purchase, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'active', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated discount and perk opportunities.`);
