import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['civic-tech-programs', 'public-interest-technology', 'community-development-programs'], tags: ['civic-tech', 'public-interest'],
    description: 'an open network, cohort, or support program through which practitioners collaborate on public-interest technology and community capacity',
    value: 'Peer learning, civic-technology resources, collaboration, program visibility, and community-development support',
    rows: [
      ['code-for-all-network', 'Code for All', 'Code for All Network', 'https://codeforall.org/'],
      ['pit-un-network', 'New America', 'Public Interest Technology University Network', 'https://pit-un.org/'],
      ['digital-public-goods-alliance', 'Digital Public Goods Alliance', 'Digital Public Goods Community', 'https://www.digitalpublicgoods.net/'],
      ['civic-tech-field-guide', 'Civic Tech Field Guide', 'Civic Tech Field Guide Community', 'https://civictech.guide/'],
      ['people-powered-accelerator', 'People Powered', 'Climate Democracy Accelerator', 'https://www.peoplepowered.org/climate-democracy-accelerator'],
      ['tictec-community', 'mySociety', 'TICTeC Community', 'https://tictec.mysociety.org/'],
      ['open-government-partnership-local', 'Open Government Partnership', 'OGP Local', 'https://www.opengovpartnership.org/ogp-local/'],
      ['what-works-cities-certification', 'Bloomberg Philanthropies', 'What Works Cities Certification', 'https://whatworkscities.bloomberg.org/'],
      ['govstack-community', 'GovStack', 'GovStack Community', 'https://www.govstack.global/community'],
      ['alliance-digital-public-infrastructure', 'UNDP', 'Digital Public Infrastructure Community', 'https://www.undp.org/digital/digital-public-infrastructure'],
    ],
  },
  {
    subcategories: ['humanitarian-programs', 'health-impact-programs', 'community-development-programs'], tags: ['humanitarian', 'health'],
    description: 'a challenge, fund, or innovation-support pathway for teams developing humanitarian, global-health, or community resilience solutions',
    value: 'Program-specific grants or investment, technical assistance, field partnerships, validation, and scaling support',
    rows: [
      ['wfp-innovation-accelerator', 'World Food Programme', 'WFP Innovation Accelerator', 'https://innovation.wfp.org/apply'],
      ['elrha-humanitarian-innovation-fund', 'Elrha', 'Humanitarian Innovation Fund', 'https://www.elrha.org/programme/humanitarian-innovation-fund/'],
      ['gsma-humanitarian-innovation-fund', 'GSMA', 'Innovation Fund for Humanitarian Challenges', 'https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma-innovation-fund/'],
      ['grand-challenges-canada', 'Grand Challenges Canada', 'Global Health Innovation Funding', 'https://www.grandchallenges.ca/funding-opportunities/'],
      ['who-eureka-innovation-space', 'World Health Organization', 'Eurêka Innovation Space Call', 'https://www.who.int/news-room/articles-detail/call-for-proposals--co-host-eur-ka-at-who-headquarters'],
      ['global-innovation-fund', 'Global Innovation Fund', 'Social Innovation Funding', 'https://www.globalinnovation.fund/apply-for-funding'],
      ['gavi-infuse', 'Gavi, the Vaccine Alliance', 'INFUSE', 'https://www.gavi.org/investing-gavi/infuse'],
      ['gates-grand-challenges', 'Gates Foundation', 'Grand Challenges Grant Opportunities', 'https://gcgh.grandchallenges.org/grant-opportunities'],
      ['unicef-venture-fund', 'UNICEF', 'UNICEF Venture Fund', 'https://www.unicef.org/innovation/venturefund'],
      ['unfpa-equalizer-accelerator', 'UNFPA', 'Equity 2030 Alliance', 'https://www.unfpa.org/equity-2030-alliance'],
    ],
  },
  {
    subcategories: ['climate-programs', 'education-impact-programs', 'community-development-programs'], tags: ['climate', 'learning'],
    description: 'a cohort, training, or community program helping participants build practical climate solutions and mobilize local action',
    value: 'Climate education, project development, peer community, facilitation resources, and program-specific implementation support',
    rows: [
      ['unleash-innovation-lab', 'UNLEASH', 'UNLEASH Innovation Lab', 'https://unleash.org/innovation-lab/'],
      ['climate-reality-leadership-corps', 'The Climate Reality Project', 'Climate Reality Leadership Corps', 'https://www.climaterealityproject.org/training'],
      ['climate-fresk-facilitator', 'Climate Fresk', 'Climate Fresk Facilitator Pathway', 'https://climatefresk.org/world/'],
      ['youth4climate-call-solutions', 'UNDP and Government of Italy', 'Youth4Climate Call for Solutions', 'https://community.youth4climate.info/'],
      ['terra-do-climate-fellowship', 'Terra.do', 'Climate Change: Learning for Action', 'https://www.terra.do/climate-fellowship/'],
      ['work-on-climate-community', 'Work on Climate', 'Work on Climate Community', 'https://workonclimate.org/'],
      ['green-software-foundation-community', 'Green Software Foundation', 'Green Software Community', 'https://wiki.greensoftware.foundation/Meetup-Network-159456c07cab807daaa6e9d60ca1096b'],
      ['ellen-macarthur-circular-economy-network', 'Ellen MacArthur Foundation', 'Circular Economy Network', 'https://www.ellenmacarthurfoundation.org/network/overview'],
      ['climatebase-fellowship', 'Climatebase', 'Climatebase Fellowship', 'https://climatebase.org/fellowship'],
      ['one-young-world-lead2030', 'One Young World', 'Lead2030 Challenge', 'https://www.oneyoungworld.com/lead2030'],
    ],
  },
  {
    subcategories: ['accessibility-programs', 'education-impact-programs', 'health-impact-programs'], tags: ['accessibility', 'inclusive-design'],
    description: 'an education, leadership, funding, or innovation program advancing accessibility, disability inclusion, or inclusive health and learning',
    value: 'Accessible-design skills, leadership development, expert networks, funding or acceleration, and implementation resources',
    rows: [
      ['teach-access-programs', 'Teach Access', 'Teach Access Programs', 'https://www.teachaccess.org/initiatives/'],
      ['xr-access-community', 'XR Access', 'XR Access Community', 'https://xraccess.org/'],
      ['disability-in-nextgen-leaders', 'Disability:IN', 'NextGen Leaders Program', 'https://disabilityin.org/learning-and-development/nextgen'],
      ['lime-connect-fellowship', 'Lime Connect', 'Lime Connect Fellowship Program', 'https://limeconnect.com/opportunities/leadership-programs/fellowship-program/'],
      ['microsoft-ai-for-accessibility', 'Microsoft', 'AI for Accessibility', 'https://www.microsoft.com/ai/ai-for-accessibility'],
      ['zero-project-call-nominations', 'Zero Project', 'Call for Nominations', 'https://zeroproject.org/research/nominate'],
      ['remarkable-accelerator', 'Remarkable', 'Remarkable Accelerator', 'https://remarkable.org/accelerator/'],
      ['unicef-accessible-digital-textbooks', 'UNICEF', 'Accessible Digital Textbooks Initiative', 'https://www.unicef.org/digitaleducation/accessible-digital-textbooks-for-all'],
      ['g3ict-smart-cities-for-all', 'G3ict', 'Smart Cities for All', 'https://smartcities4all.org/'],
      ['google-startups-accessibility-accelerator', 'Google for Startups', 'Accessibility Accelerator', 'https://startup.google.com/programs/accelerator/'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'social-impact-civic-tech', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Applicants or participants must meet the current mission alignment, project stage, location, cohort timing, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated social-impact and civic-tech opportunities.`);
