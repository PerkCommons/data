import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['innovation-awards', 'founder-awards'], tags: ['innovation', 'founders'],
    description: 'an established awards program recognizing founders, entrepreneurs, products, or organizations responsible for notable innovation',
    value: 'Independent recognition, visibility, peer credibility, and program-specific finalist or winner benefits',
    rows: [
      ['edison-awards', 'Edison Awards', 'Edison Awards', 'https://edisonawards.com/'],
      ['fast-company-world-changing-ideas', 'Fast Company', 'World Changing Ideas Awards', 'https://www.fastcompany.com/apply/world-changing-ideas'],
      ['sxsw-innovation-awards', 'SXSW', 'SXSW Innovation Awards', 'https://sxsw.com/awards/innovation-awards/'],
      ['ces-innovation-awards', 'Consumer Technology Association', 'CES Innovation Awards', 'https://www.ces.tech/innovation-awards/'],
      ['wipo-global-awards', 'World Intellectual Property Organization', 'WIPO Global Awards', 'https://www.wipo.int/en/web/awards/global'],
      ['european-inventor-award', 'European Patent Office', 'European Inventor Award', 'https://www.epo.org/en/news-events/european-inventor-award'],
      ['global-startup-awards', 'Global Startup Awards', 'Global Startup Awards', 'https://www.globalstartupawards.com/'],
      ['ey-entrepreneur-of-the-year', 'EY', 'Entrepreneur Of The Year', 'https://www.ey.com/en_gl/entrepreneur-of-the-year'],
      ['cartier-womens-initiative-awards', 'Cartier Women’s Initiative', 'Cartier Women’s Initiative Awards', 'https://www.cartierwomensinitiative.com/awards'],
      ['foya-awards', 'FOYA Global', 'FOYA Awards', 'https://www.foyaglobal.com/'],
    ],
  },
  {
    subcategories: ['student-awards', 'research-awards'], tags: ['students', 'research'],
    description: 'a research or academic awards program in which eligible students present or submit original work for recognition',
    value: 'Research recognition, feedback, visibility, and program-specific prizes or advancement opportunities',
    rows: [
      ['regeneron-science-talent-search', 'Society for Science', 'Regeneron Science Talent Search', 'https://www.societyforscience.org/regeneron-sts/'],
      ['regeneron-isef', 'Society for Science', 'Regeneron International Science and Engineering Fair', 'https://www.societyforscience.org/isef/'],
      ['global-undergraduate-awards', 'The Global Undergraduate Awards', 'Global Undergraduate Awards', 'https://undergraduateawards.com/'],
      ['acm-student-research-competition', 'Association for Computing Machinery', 'ACM Student Research Competition', 'https://src.acm.org/'],
      ['stockholm-junior-water-prize', 'Stockholm International Water Institute', 'Stockholm Junior Water Prize', 'https://siwi.org/stockholm-junior-water-prize/'],
      ['breakthrough-junior-challenge', 'Breakthrough Prize Foundation', 'Breakthrough Junior Challenge', 'https://breakthroughjuniorchallenge.org/'],
      ['young-scientist-challenge', '3M and Discovery Education', 'Young Scientist Challenge', 'https://youngscientistlab.com/challenge'],
      ['davidson-fellows-scholarship', 'Davidson Institute', 'Davidson Fellows Scholarship', 'https://www.davidsongifted.org/gifted-programs/fellows-scholarship/'],
      ['cra-undergraduate-researcher-award', 'Computing Research Association', 'Outstanding Undergraduate Researcher Award', 'https://cra.org/about/awards/outstanding-undergraduate-researcher-award/'],
      ['queen-commonwealth-essay-competition', 'Royal Commonwealth Society', 'Queen’s Commonwealth Writing Competition', 'https://www.royalcwsociety.org/writing-competition'],
    ],
  },
  {
    subcategories: ['open-source-awards', 'community-awards'], tags: ['open-source', 'community'],
    description: 'a nomination or recognition program honoring sustained contribution, leadership, or impact in an open-source community',
    value: 'Community recognition, public visibility, and acknowledgment of open-source service or leadership',
    rows: [
      ['fsf-free-software-awards', 'Free Software Foundation', 'Free Software Awards', 'https://www.fsf.org/awards/'],
      ['python-community-service-awards', 'Python Software Foundation', 'Python Community Service Awards', 'https://www.python.org/community/awards/'],
      ['drupal-aaron-winborn-award', 'Drupal Association', 'Aaron Winborn Award', 'https://www.drupal.org/community/cwg/aaron-winborn-award'],
      ['kubernetes-contributor-awards', 'Kubernetes', 'Kubernetes Contributor Awards', 'https://www.kubernetes.dev/community/awards/'],
      ['openuk-awards', 'OpenUK', 'OpenUK Awards', 'https://openuk.uk/awards/'],
      ['eclipse-community-awards', 'Eclipse Foundation', 'Eclipse Community Awards', 'https://www.eclipse.org/org/foundation/eclipseawards/'],
      ['django-malcolm-tredinnick-prize', 'Django Software Foundation', 'Malcolm Tredinnick Memorial Prize', 'https://www.djangoproject.com/foundation/prizes/'],
      ['ow2-community-awards', 'OW2', 'OW2 Community Awards', 'https://www.ow2con.org/view/2026/Awards'],
      ['open-source-excellence-awards', 'Open Source Initiative', 'Open Source Initiative Awards and Recognition', 'https://opensource.org/community/'],
      ['red-hat-certified-professional-awards', 'Red Hat', 'Red Hat Certified Professional of the Year', 'https://www.redhat.com/en/services/certification/rhcp/rhcp-of-the-year/rules'],
    ],
  },
  {
    subcategories: ['social-impact-awards', 'community-awards'], tags: ['social-impact', 'community'],
    description: 'a recognition program honoring measurable public benefit, community leadership, environmental action, or social innovation',
    value: 'Public recognition, network access, visibility, and award-specific funding or support',
    rows: [
      ['skoll-award-social-innovation', 'Skoll Foundation', 'Skoll Award for Social Innovation', 'https://skoll.org/community/awards/'],
      ['schwab-social-innovation-awards', 'Schwab Foundation for Social Entrepreneurship', 'Social Innovation Awards', 'https://www.schwabfound.org/awards'],
      ['elevate-prize', 'Elevate Prize Foundation', 'Elevate Prize', 'https://elevateprize.org/the-elevate-prize/'],
      ['ashden-awards', 'Ashden', 'Ashden Awards', 'https://ashden.org/awards/'],
      ['un-sdg-action-awards', 'United Nations SDG Action Campaign', 'UN SDG Action Awards', 'https://sdgactionawards.org/'],
      ['goldman-environmental-prize', 'Goldman Environmental Foundation', 'Goldman Environmental Prize', 'https://www.goldmanprize.org/'],
      ['right-livelihood-award', 'Right Livelihood', 'Right Livelihood Award', 'https://rightlivelihood.org/get-involved/support-us/nominate/'],
      ['aurora-prize-awakening-humanity', 'Aurora Humanitarian Initiative', 'Aurora Prize for Awakening Humanity', 'https://auroraprize.com/en/prize'],
      ['anthem-awards', 'The Webby Awards', 'Anthem Awards', 'https://www.anthemawards.com/'],
      ['global-citizen-prize', 'Global Citizen', 'Global Citizen Prize', 'https://www.globalcitizen.org/en/prize/'],
    ],
  },
  {
    subcategories: ['creator-awards', 'innovation-awards'], tags: ['creative-work', 'design'],
    description: 'a juried creative award accepting eligible work from designers, makers, studios, writers, or digital creators',
    value: 'Juried recognition, portfolio visibility, publication, and award-specific exhibition or networking benefits',
    rows: [
      ['webby-awards', 'International Academy of Digital Arts and Sciences', 'The Webby Awards', 'https://www.webbyawards.com/'],
      ['shorty-awards', 'Shorty Awards', 'Shorty Awards', 'https://shortyawards.com/'],
      ['d-and-ad-awards', 'D&AD', 'D&AD Awards', 'https://www.dandad.org/awards/'],
      ['one-club-adc-awards', 'The One Club for Creativity', 'ADC Annual Awards', 'https://www.oneclub.org/awards/adcawards/'],
      ['communication-arts-competitions', 'Communication Arts', 'Communication Arts Competitions', 'https://www.commarts.com/competitions'],
      ['european-design-awards', 'European Design Awards', 'European Design Awards', 'https://europeandesign.org/'],
      ['red-dot-design-award', 'Red Dot', 'Red Dot Design Award', 'https://www.red-dot.org/'],
      ['if-design-award', 'iF Design', 'iF Design Award', 'https://ifdesign.com/en/if-design-award-and-jury'],
      ['indigo-design-award', 'Indigo Design Award', 'Indigo Design Award', 'https://www.indigoaward.com/'],
      ['aiga-50-books-50-covers', 'AIGA', '50 Books | 50 Covers', 'https://www.aiga.org/professional-development/competitions-campaigns/50-books-50-covers'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'awards-recognition', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Candidates must meet the current nomination or entry window, geography, age, work ownership, fee, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated award and recognition opportunities.`);
