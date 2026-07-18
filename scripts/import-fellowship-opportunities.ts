import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups = [
  {
    subcategories: ['technical-fellowships', 'open-source-fellowships'],
    tags: ['open-source', 'technology'],
    label: 'an open-source technical fellowship or mentored contribution program',
    value: 'Mentoring, practical open-source experience, and program-specific stipend or support',
    rows: [
      ['google-summer-of-code','Google','Google Summer of Code','https://summerofcode.withgoogle.com/'],
      ['outreachy-internships','Software Freedom Conservancy','Outreachy Internships','https://www.outreachy.org/'],
      ['mlh-fellowship','Major League Hacking','MLH Fellowship','https://fellowship.mlh.io/'],
      ['lfx-mentorship','Linux Foundation','LFX Mentorship','https://lfx.linuxfoundation.org/tools/mentorship/'],
      ['cncf-mentoring-initiatives','Cloud Native Computing Foundation','CNCF Mentoring Initiatives','https://contribute.cncf.io/contributors/'],
      ['open-mainframe-project-mentorship','Open Mainframe Project','Mentorship Program','https://www.openmainframeproject.org/projects/mentorship'],
      ['summer-of-bitcoin','Summer of Bitcoin','Summer of Bitcoin','https://www.summerofbitcoin.org/'],
      ['processing-foundation-fellowships','Processing Foundation','Fellowship Program','https://processingfoundation.org/fellowships'],
      ['season-of-kde','KDE Community','Season of KDE','https://season.kde.org/'],
      ['julia-seasons-of-contributions','The Julia Language','Julia Seasons of Contributions','https://julialang.org/jsoc/'],
    ] as Row[],
  },
  {
    subcategories: ['research-fellowships', 'student-fellowships'],
    tags: ['research', 'graduate-students'],
    label: 'a competitive graduate research fellowship',
    value: 'Research funding, mentoring, recognition, or program-specific academic support',
    rows: [
      ['google-phd-fellowship','Google','PhD Fellowship Program','https://research.google/programs-and-events/phd-fellowship/'],
      ['meta-phd-fellowship','Meta Research','PhD Fellowship','https://research.facebook.com/fellowship/'],
      ['microsoft-research-fellowship','Microsoft Research','Microsoft Research Fellowship','https://www.microsoft.com/en-us/research/academic-program/microsoft-research-fellowship/'],
      ['nvidia-graduate-fellowship','NVIDIA','Graduate Fellowship Program','https://research.nvidia.com/graduate-fellowships'],
      ['apple-scholars-ai-ml','Apple','Apple Scholars in AI/ML','https://machinelearning.apple.com/updates/apple-scholars-aiml-2026'],
      ['qualcomm-innovation-fellowship','Qualcomm','Innovation Fellowship','https://www.qualcomm.com/research/university-relations/innovation-fellowship'],
      ['gem-fellowship','National GEM Consortium','GEM Fellowship','https://www.gemfellowship.org/gem-fellowship-program/'],
      ['doe-computational-science-graduate-fellowship','U.S. Department of Energy','Computational Science Graduate Fellowship','https://www.krellinst.org/csgf/'],
      ['ndseg-fellowship','U.S. Department of Defense','National Defense Science and Engineering Graduate Fellowship','https://ndseg.org/'],
      ['link-foundation-fellowship','Link Foundation','Modeling, Simulation, and Training Fellowship','https://linksim.org/apply/'],
    ] as Row[],
  },
  {
    subcategories: ['policy-fellowships'],
    tags: ['policy', 'public-interest'],
    label: 'a policy fellowship',
    value: 'Policy placement, research time, training, mentoring, or a program-specific stipend',
    rows: [
      ['aaas-science-technology-policy-fellowships','AAAS','Science & Technology Policy Fellowships','https://www.aaas.org/programs/science-technology-policy-fellowships'],
      ['techcongress-congressional-innovation-fellowship','TechCongress','Congressional Innovation Fellowship','https://techcongress.io/apply'],
      ['presidential-innovation-fellows','U.S. General Services Administration','Presidential Innovation Fellows','https://presidentialinnovationfellows.gov/'],
      ['aspen-tech-policy-hub-fellowship','Aspen Institute','Tech Policy Hub Fellowship','https://www.aspentechpolicyhub.org/fellowship'],
      ['scoville-peace-fellowship','Herbert Scoville Jr. Peace Fellowship','Scoville Peace Fellowship','https://scoville.org/'],
      ['cfr-international-affairs-fellowship','Council on Foreign Relations','International Affairs Fellowship','https://www.cfr.org/fellowships/international-affairs-fellowship'],
      ['wilson-center-fellowship','Wilson Center','Wilson Center Fellowship','https://www.wilsoncenter.org/fellowship-application'],
      ['internet-society-early-career-fellowship','Internet Society','Early Career Fellowship','https://www.internetsociety.org/fellowships/early-career/'],
      ['belfer-technology-geopolitics-fellowship','Harvard Kennedy School Belfer Center','Technology and Geopolitics Fellowship','https://www.belfercenter.org/fellowship/technology-and-geopolitics'],
      ['r-street-policy-fellowship','R Street Institute','Congressional Fellowship in AI Policy','https://www.rstreet.org/aifellowship/'],
    ] as Row[],
  },
  {
    subcategories: ['entrepreneurship-fellowships'],
    tags: ['entrepreneurship', 'founders'],
    label: 'an entrepreneurship fellowship',
    value: 'Founder development, mentoring, peer network, and program-specific funding or support',
    rows: [
      ['echoing-green-fellowship','Echoing Green','Echoing Green Fellowship','https://echoinggreen.org/fellowship/'],
      ['acumen-fellows','Acumen Academy','Acumen Fellows Program','https://acumenacademy.org/fellowship/'],
      ['cartier-womens-initiative-fellowship','Cartier Women\'s Initiative','Fellowship Program','https://www.cartierwomensinitiative.com/fellowship-programme'],
      ['halcyon-residential-fellowship','Halcyon','Halcyon Founder Fellowships','https://www.halcyonhouse.org/news/a-bold-new-vision-and-home-for-halcyon/'],
      ['thiel-fellowship','Thiel Foundation','Thiel Fellowship','https://thielfellowship.org/'],
      ['kauffman-fellows-program','Kauffman Fellows','Kauffman Fellows Program','https://www.kauffmanfellows.org/program'],
      ['ashoka-fellowship','Ashoka','Ashoka Fellowship','https://www.ashoka.org/en-us/program/ashoka-fellowship'],
      ['tory-burch-foundation-fellows','Tory Burch Foundation','Fellows Program','https://www.toryburchfoundation.org/fellows/'],
      ['global-good-fund-fellowship','The Global Good Fund','Fellowship Program','https://globalgoodfund.org/fellowship/'],
      ['south-park-commons-founder-fellowship','South Park Commons','Founder Fellowship','https://www.southparkcommons.com/founder-fellowship'],
    ] as Row[],
  },
  {
    subcategories: ['social-impact-fellowships'],
    tags: ['social-impact', 'leadership'],
    label: 'a social-impact leadership fellowship',
    value: 'Leadership development, mentoring, community, and program-specific project support',
    rows: [
      ['coro-fellows-public-affairs','Coro','Fellows Program in Public Affairs','https://corofellowship.org/'],
      ['dalai-lama-fellows','Dalai Lama Center for Ethics and Transformative Values','Dalai Lama Fellows','https://www.dalailamafellows.org/'],
      ['millennium-fellowship','United Nations Academic Impact and MCN','Millennium Fellowship','https://www.millenniumfellows.org/'],
      ['community-solutions-program','IREX','Community Solutions Program','https://www.irex.org/program/community-solutions-program-application-information'],
      ['obama-foundation-scholars','Obama Foundation','Obama Foundation Scholars','https://www.obama.org/programs/scholars/'],
      ['young-leaders-for-sdgs','United Nations','Young Leaders for the Sustainable Development Goals','https://www.un.org/youthenvoy/young-leaders-for-the-sdgs/'],
      ['leadership-for-equity-fellowship','Leadership for Equity','Sadhana Fellowship','https://www.leadershipforequity.org/sadhana-teaching-excellence-lab'],
      ['social-change-initiative-fellowship','Social Change Initiative','Fellowship Programme','https://www.socialchangeinitiative.com/fellowships'],
      ['global-health-corps-fellowship','Global Health Corps','Africa Leadership Accelerator','https://ghcorps.org/africa-leadership-accelerator-overview/'],
      ['wild-gift-fellowship','Wild Gift','Fellowship','https://www.wildgift.org/fellowship/'],
    ] as Row[],
  },
  {
    subcategories: ['creator-fellowships'],
    tags: ['creators', 'arts'],
    label: 'a fellowship for artists, writers, journalists, or other creative practitioners',
    value: 'Creative time, workspace, mentoring, peer community, or program-specific stipend',
    rows: [
      ['macdowell-fellowship','MacDowell','MacDowell Fellowship','https://www.macdowell.org/apply'],
      ['yaddo-residency','Yaddo','Yaddo Residency','https://www.yaddo.org/apply/'],
      ['nieman-fellowship','Nieman Foundation at Harvard','Nieman Fellowship','https://nieman.harvard.edu/fellowships/'],
      ['knight-wallace-fellowship','Wallace House Center for Journalists','Knight-Wallace Fellowship','https://wallacehouse.umich.edu/knight-wallace/'],
      ['reuters-institute-journalism-fellowship','Reuters Institute for the Study of Journalism','Journalist Fellowship Programme','https://reutersinstitute.politics.ox.ac.uk/our-journalist-fellowship-programme'],
      ['princeton-arts-fellowships','Princeton University Lewis Center for the Arts','Princeton Arts Fellowships','https://arts.princeton.edu/fellowships/princeton-arts-fellowship/'],
      ['bogliasco-fellowship','Bogliasco Foundation','Bogliasco Fellowship','https://bfny.org/en/apply'],
      ['cullman-center-fellowship','New York Public Library','Cullman Center Fellowship','https://www.nypl.org/help/about-nypl/fellowships-institutes/center-for-scholars-and-writers/fellowships'],
      ['hodder-fellowship','Princeton University Lewis Center for the Arts','Hodder Fellowship','https://arts.princeton.edu/fellowships/hodder-fellowship/'],
      ['sundance-institute-fellowships','Sundance Institute','Artist Programs and Fellowships','https://www.sundance.org/apply/'],
    ] as Row[],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) {
  for (const [id, provider, title, url] of group.rows) {
    const record = {
      id, provider, title,
      category: 'fellowships',
      subcategories: group.subcategories,
      tags: group.tags,
      description: `${title} is ${group.label} administered by ${provider}.`,
      eligibility: 'Applicants must meet the current career-stage, location, experience, affiliation, conduct, and application requirements.',
      value: group.value,
      sourceUrl: url,
      officialUrl: url,
      status: 'limited',
      submissionType: 'maintainer',
      sponsor: false,
      reviewDate: '2026-07-18',
      regions: ['Global'],
    };
    await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
    count += 1;
  }
}
console.log(`Wrote ${count} curated fellowship opportunities.`);
