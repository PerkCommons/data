import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];

const groups: Array<{
  rows: Row[];
  subcategories: string[];
  description: (title: string, provider: string) => string;
  eligibility: string;
  value: string;
}> = [
  {
    subcategories: ['startup-accelerators', 'pre-accelerators'],
    description: (title, provider) => `${title} is an early-stage founder program from ${provider} that helps participants validate, launch, or accelerate a startup.`,
    eligibility: 'Founders must meet the current company-stage, team, geography, commitment, and selection requirements.',
    value: 'Structured early-stage support, mentoring, and founder resources',
    rows: [
      ['y-combinator-startup-school','Y Combinator','Startup School','https://www.startupschool.org/'],
      ['founder-institute-core-program','Founder Institute','Core Program','https://fi.co/program'],
      ['antler-residency','Antler','Antler Residency','https://www.antler.co/residency'],
      ['entrepreneur-first-program','Entrepreneur First','Entrepreneur First Program','https://www.joinef.com/'],
      ['masschallenge-early-stage-accelerator','MassChallenge','Early Stage Accelerator','https://masschallenge.org/programs/early-stage/'],
      ['google-for-startups-startup-school','Google for Startups','Startup School','https://startup.google.com/programs/startup-school/'],
      ['techstars-founder-catalyst','Techstars','Founder Catalyst','https://www.techstars.com/founder-catalyst'],
      ['aws-build-accelerator','Amazon Web Services','AWS Build Accelerator','https://aws.amazon.com/startups/accelerators/'],
      ['startupbootcamp-accelerators','Startupbootcamp','Startupbootcamp Accelerator Programs','https://startupbootcamp.org/startups/accelerators'],
      ['alchemist-accelerator','Alchemist Accelerator','Alchemist Accelerator','https://www.alchemistaccelerator.com/'],
    ],
  },
  {
    subcategories: ['nonprofit-accelerators', 'social-impact-accelerators'],
    description: (title, provider) => `${title} is a capacity-building accelerator from ${provider} for nonprofits, NGOs, or other mission-driven organizations working toward measurable social impact.`,
    eligibility: 'Mission-driven organizations must satisfy the current legal-status, impact, stage, location, and cohort requirements.',
    value: 'Cohort training, expert support, peer learning, and program-specific resources',
    rows: [
      ['fast-forward-accelerator','Fast Forward','Tech Nonprofit Accelerator','https://www.ffwd.org/accelerator/'],
      ['ou-impact-accelerator','Orthodox Union','OU Impact Accelerator','https://accelerator.ou.org/apply/'],
      ['hp-future-of-work-accelerator','HP Foundation','Future of Work Accelerator','https://www.hp.com/us-en/sustainability-progress/advance-societal-impact/accelerator.html'],
      ['bcg-x-social-impact-accelerator','BCG X','Social Impact Accelerator','https://www.bcg.com/x/social-impact-accelerator/about'],
      ['social-enterprise-greenhouse-accelerator','Social Enterprise Greenhouse','Impact Accelerator','https://segri.org/accelerator/'],
      ['analytics-better-world-impact-accelerator','Analytics for a Better World','Impact Accelerator Program','https://analyticsbetterworld.org/the-impact-accelerator-program/'],
      ['inspire-brands-spark-accelerator','Inspire Brands Foundation','SPARK Nonprofit Accelerator','https://foundation.inspirebrands.com/spark-apply/'],
      ['google-org-accelerator','Google.org','Google.org Accelerator','https://www.google.org/our-work/'],
      ['social-innovation-forum-accelerator','Social Innovation Forum','Social Innovator Accelerator','https://socialinnovationforum.org/programs/social-innovator-accelerator'],
      ['globalgiving-accelerator','GlobalGiving','GlobalGiving Accelerator','https://www.globalgiving.org/nonprofits/join-globalgiving/application.html'],
    ],
  },
  {
    subcategories: ['student-incubators', 'university-incubators'],
    description: (title, provider) => `${title} is a university-connected venture program from ${provider} that helps eligible student founders develop and test new ventures.`,
    eligibility: 'Teams must meet the current student or university-affiliation, venture-stage, location, and participation requirements.',
    value: 'University venture training, mentoring, workspace or funding opportunities',
    rows: [
      ['mit-delta-v','MIT Martin Trust Center','MIT delta v','https://entrepreneurship.mit.edu/accelerator/'],
      ['harvard-ilab-venture-program','Harvard Innovation Labs','Venture Program','https://innovationlabs.harvard.edu/venture-program/'],
      ['stanford-venture-studio','Stanford Graduate School of Business','Venture Studio','https://www.gsb.stanford.edu/experience/learning/entrepreneurship/venture-studio'],
      ['berkeley-skydeck','UC Berkeley','Berkeley SkyDeck','https://skydeck.berkeley.edu/'],
      ['cornell-elab','Cornell University','eLab Student Accelerator','https://www.elabstartup.com/'],
      ['nyu-summer-launchpad','NYU Entrepreneurial Institute','Summer Launchpad','https://entrepreneur.nyu.edu/resource/summer-launchpad/'],
      ['yale-tsai-city-accelerator','Yale Tsai Center for Innovative Thinking','Venture Development Programs','https://city.yale.edu/programs'],
      ['uchicago-polsky-accelerator','Polsky Center at the University of Chicago','Polsky Accelerator','https://polsky.uchicago.edu/programs-events/polsky-accelerator/'],
      ['babson-summer-venture-program','Babson College','Summer Venture Program','https://entrepreneurship.babson.edu/summer-venture-program/'],
      ['cambridge-accelerate-cambridge','Cambridge Judge Business School','Accelerate Cambridge','https://www.jbs.cam.ac.uk/entrepreneurship/programmes/accelerate-cambridge/programmes/'],
    ],
  },
  {
    subcategories: ['climate-accelerators', 'social-impact-accelerators'],
    description: (title, provider) => `${title} is an accelerator from ${provider} for ventures developing climate, sustainability, or environmental-impact solutions.`,
    eligibility: 'Ventures must meet the current climate focus, company stage, technology, geography, and cohort requirements.',
    value: 'Climate venture mentoring, partnerships, technical support, and program-specific funding',
    rows: [
      ['elemental-impact-accelerator','Elemental Impact','Elemental Portfolio Program','https://elementalimpact.com/apply/'],
      ['third-derivative-accelerator','Third Derivative','Climate Tech Accelerator','https://www.third-derivative.org/startups'],
      ['greentown-labs-acceleration','Greentown Labs','Greentown Go Programs','https://greentownlabs.com/entrepreneur-support/greentown-go/'],
      ['amazon-sustainability-accelerator','Amazon','Amazon Sustainability Accelerator: Climate Tech','https://sustainability.aboutamazon.com/sustainability-accelerator-climate-tech'],
      ['google-climate-change-accelerator','Google for Startups','Accelerator: Energy','https://blog.google/company-news/outreach-and-initiatives/entrepreneurs/google-for-startups-accelerator/'],
      ['one-hundred-plus-accelerator','100+ Accelerator','100+ Accelerator','https://www.100accelerator.com/'],
      ['cleantech-open-accelerator','Cleantech Open','Cleantech Open Accelerator','https://www.cleantechopen.org/en/page/2026-cto-accelerator-en'],
      ['katapult-ocean-accelerator','Katapult Ocean','Ocean Accelerator','https://katapult.vc/ocean/'],
      ['rockstart-energy-program','Rockstart','Energy Accelerator','https://rockstart.com/energy/'],
      ['deepmind-ai-for-the-planet','Google DeepMind','AI for the Planet Accelerator','https://deepmind.google/accelerators/ai-for-the-planet/'],
    ],
  },
  {
    subcategories: ['ai-accelerators', 'startup-accelerators'],
    description: (title, provider) => `${title} is a startup support or accelerator program from ${provider} for teams building artificial-intelligence products or infrastructure.`,
    eligibility: 'AI startups must satisfy the current product focus, company stage, geography, technical, and selection requirements.',
    value: 'AI technical support, mentoring, ecosystem access, and program-specific credits or funding',
    rows: [
      ['aws-generative-ai-accelerator','Amazon Web Services','AWS Generative AI Accelerator','https://aws.amazon.com/startups/accelerators/generative-ai/'],
      ['google-ai-first-accelerator','Google for Startups','AI First Accelerator','https://startup.google.com/programs/accelerator/'],
      ['nvidia-inception','NVIDIA','NVIDIA Inception','https://www.nvidia.com/en-us/startups/'],
      ['intel-liftoff','Intel','Intel Liftoff for AI Startups','https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/startup-program/overview.html'],
      ['ai2-incubator','AI2 Incubator','AI2 Incubator','https://www.ai2incubator.com/'],
      ['meta-llama-startup-program','Meta and AWS','Llama Startup Program','https://ai.meta.com/blog/aws-program-startups-build-with-llama/'],
      ['microsoft-ai-startups','Microsoft','Microsoft for Startups AI','https://www.microsoft.com/en-us/startups/ai'],
      ['national-ai-accelerator','Enterprise Technology Association','National AI Accelerator','https://www.joineta.org/accelerator'],
      ['max-planck-ai-incubator','Max Planck Institute for Intelligent Systems','AI Incubator','https://ai-incubator.is.mpg.de/'],
      ['hong-kong-ai-lab-accelerator','HKAI LAB','Global Acceleration Program','https://hongkongai.org/wp-content/uploads/2026/02/HKAI-Global-Acceleration-Program-Application_Info-Kit_C13_Eng_Final.pdf'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) {
  for (const [id, provider, title, url] of group.rows) {
    const opportunity = {
      id,
      provider,
      title,
      category: 'accelerators-incubators',
      subcategories: group.subcategories,
      tags: ['accelerator', 'entrepreneurship'],
      description: group.description(title, provider),
      eligibility: group.eligibility,
      value: group.value,
      sourceUrl: url,
      officialUrl: url,
      status: 'limited',
      submissionType: 'maintainer',
      sponsor: false,
      reviewDate: '2026-07-18',
      regions: ['Global'],
    };
    await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(opportunity, null, 2)}\n`);
    count += 1;
  }
}
console.log(`Wrote ${count} curated accelerator opportunities.`);
