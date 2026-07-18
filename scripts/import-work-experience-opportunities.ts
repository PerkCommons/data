import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups = [
  {
    subcategories: ['internships', 'project-based-experience'], tags: ['internships', 'early-career'],
    label: 'a structured internship program', value: 'Supervised professional projects, learning, and program-specific compensation or support',
    rows: [
      ['nasa-internships','NASA','NASA Internship Programs','https://www.nasa.gov/learning-resources/internship-programs/'],
      ['cern-student-programmes','CERN','Student Programmes and Internships','https://careers.cern/programmes/'],
      ['esa-student-internships','European Space Agency','Student Internships','https://www.esa.int/About_Us/Careers_at_ESA/Student_Internships2'],
      ['world-bank-internship-program','World Bank','World Bank Internship Program','https://www.worldbank.org/en/about/careers/programs-and-internships/internship'],
      ['unicef-internship-programme','UNICEF','Internship Programme','https://www.unicef.org/careers/internships'],
      ['oecd-internship-programme','OECD','Internship Programme','https://www.oecd.org/careers/internship-programme/'],
      ['united-nations-internships','United Nations','United Nations Internships','https://careers.un.org/jobopenings?language=en&data=%7B%22jle%22:%5B%22Internship%22%5D%7D'],
      ['smithsonian-internships','Smithsonian Institution','Smithsonian Internships','https://internships.si.edu/'],
      ['who-internship-programme','World Health Organization','Internship Programme','https://www.who.int/careers/internship-programme'],
      ['nato-internship-programme','NATO','NATO Internship Programme','https://www.nato.int/cps/en/natohq/71157.htm'],
    ] as Row[],
  },
  {
    subcategories: ['apprenticeships', 'traineeships'], tags: ['apprenticeships', 'career-change'],
    label: 'a structured apprenticeship or career-entry training program', value: 'Paid or supported work-based training and role-specific professional experience',
    rows: [
      ['google-apprenticeships','Google','Google Apprenticeships','https://buildyourfuture.withgoogle.com/apprenticeships'],
      ['microsoft-leap','Microsoft','Microsoft Leap','https://leap.microsoft.com/'],
      ['ibm-apprenticeship-program','IBM','IBM Apprenticeship Program','https://www.ibm.com/us-en/careers/career-opportunities/entry-level/apprenticeship'],
      ['amazon-technical-apprenticeship','Amazon','Amazon Technical Apprenticeship','https://www.amazon.jobs/content/en/career-programs/us-rme-apprenticeship'],
      ['accenture-apprenticeships','Accenture','Apprenticeship Program','https://www.accenture.com/us-en/careers/life-at-accenture/apprenticeships'],
      ['visa-technology-apprenticeship','Visa','Technology Apprenticeship Program','https://careers.smartrecruiters.com/Visa/technology-apprenticeship-program'],
      ['pinterest-apprenticeship','Pinterest','Engineering Apprenticeship Program','https://www.pinterestcareers.com/early-career/apprenticeship-development-programs/'],
      ['linkedin-reach','LinkedIn','REACH Apprenticeship Program','https://careers.linkedin.com/reach'],
      ['airbnb-connect-apprenticeship','Airbnb','Connect Engineering Apprenticeship','https://careers.airbnb.com/connect-engineering-apprenticeship/'],
      ['spotify-technology-fellowship','Spotify','Technology Fellowship Program','https://www.lifeatspotify.com/students'],
    ] as Row[],
  },
  {
    subcategories: ['externships', 'project-based-experience'], tags: ['externships', 'remote'],
    label: 'a remote project-based externship listed by Extern', value: 'Guided project work, portfolio deliverables, professional exposure, and any listed stipend',
    rows: [
      ['beats-creative-advertising-externship','Beats by Dr. Dre and Extern','Creative Advertising Strategy Externship','https://www.extern.com/externships'],
      ['beats-data-analytics-externship','Beats by Dr. Dre and Extern','Data Analytics Insights Externship','https://www.extern.com/externships'],
      ['youth-justice-data-externship','Center for Improving Youth Justice and Extern','Data-Driven Decision-Making Externship','https://www.extern.com/externships'],
      ['mental-health-operations-externship','Institute of Mental Health and Extern','Healthcare Operations and Consulting Externship','https://www.extern.com/externships'],
      ['mangusta-capital-externship','Mangusta Capital and Extern','Deal Sourcing and Startup Analysis Externship','https://www.extern.com/externships'],
      ['bereal-product-management-externship','BeReal and Extern','Product Management Externship','https://www.extern.com/externships'],
      ['breaking-games-sql-externship','Breaking Games and Extern','SQL and Database Architecture Externship','https://www.extern.com/externships'],
      ['amazon-people-analytics-externship','Amazon and Extern','Operational Strategy and People Analytics Externship','https://www.extern.com/externships'],
      ['hp-tech-ventures-externship','HP Tech Ventures and Extern','Deal Sourcing and Startup Analysis Externship','https://www.extern.com/externships'],
      ['hydroficient-cyber-defense-externship','Hydroficient and Extern','IoT Cyber Defense Externship','https://www.extern.com/externships'],
    ] as Row[],
  },
  {
    subcategories: ['externships', 'job-shadowing-programs'], tags: ['job-shadowing', 'career-exploration'],
    label: 'a short-term job-shadow or externship program', value: 'Workplace observation, career exploration, and professional networking',
    rows: [
      ['uc-davis-leadership-job-shadow','University of California, Davis','Leadership Job Shadow Program','https://chancellor.ucdavis.edu/leadership-job-shadow-program-application'],
      ['ucf-knight-shadow','University of Central Florida','Knight Shadow Program','https://career.ucf.edu/experiential-opportunities/'],
      ['utm-job-shadow-program','University of Toronto Mississauga','Job Shadow Program','https://www.utm.utoronto.ca/careers/career-exploration/job-shadow-program/job-shadow-program-information-students'],
      ['uiowa-hawkshadow','University of Iowa','HawkShadow Program','https://our.research.uiowa.edu/news/2026/01/hawk-shadow-program'],
      ['udel-job-shadow','University of Delaware','Job Shadow Program','https://www.udel.edu/students/career/career-development-support/job-shadow-programs/'],
      ['cal-job-shadow','University of California, Berkeley','Cal Job Shadow Program','https://www.career.berkeley.edu/find-opportunities/experiential-learning/externship-program/'],
      ['oregon-state-job-shadow','Oregon State University','Job Shadow Program','https://career.oregonstate.edu/explore-careers/job-shadows'],
      ['vandyshadow','Vanderbilt University','VandyShadow','https://www.vanderbilt.edu/career/experiential-learning-treks/vandyshadow/'],
      ['uw-madison-job-shadow','University of Wisconsin-Madison','SuccessWorks Job Shadow Program','https://successworks.wisc.edu/job-shadow-program/'],
      ['vanguard-job-shadow','Vanguard University','Job Shadow Program','https://www.vanguard.edu/resources/career-services/for-employers/job-shadowing-program-21/job-shadowing-program-faq'],
    ] as Row[],
  },
  {
    subcategories: ['returnships', 'traineeships'], tags: ['returnships', 'career-reentry'],
    label: 'a structured return-to-work program for experienced professionals after a career break', value: 'Re-entry training, paid project work, mentoring, and potential pathways to continuing roles',
    rows: [
      ['blackrock-career-returnship','BlackRock','Career Returnship Program','https://careers.blackrock.com/en/career-returnship-programs'],
      ['goldman-sachs-returnship','Goldman Sachs','Returnship','https://www.goldmansachs.com/careers/professionals/returnship'],
      ['jpmorgan-reentry-program','JPMorgan Chase','ReEntry Program','https://careers.jpmorgan.com/us/en/students/programs/reentry-program'],
      ['morgan-stanley-return-to-work','Morgan Stanley','Return to Work Program','https://www.morganstanley.com/people-opportunities/return-to-work'],
      ['ibm-tech-reentry','IBM','Tech Re-Entry Program','https://www.ibm.com/us-en/careers/tech-re-entry'],
      ['accenture-career-reboot','Accenture','Career Reboot Program','https://www.accenture.com/in-en/careers/life-at-accenture/career-reboot-program'],
      ['deloitte-encore','Deloitte','Encore Program','https://www.deloitte.com/us/en/careers/join-deloitte/encore-program.html'],
      ['sap-returnship','SAP','SAP Returnship Program','https://jobs.sap.com/go/Returnship/9268401/'],
      ['intuit-again','Intuit','Intuit Again Returnship','https://www.intuit.com/careers/programs/intuit-again/'],
      ['schneider-electric-returnship','Schneider Electric','Returnship Program','https://www.se.com/ww/en/about-us/careers/returnship-program/'],
    ] as Row[],
  },
  {
    subcategories: ['residencies', 'project-based-experience'], tags: ['residencies', 'creative-technology'],
    label: 'a project-based professional or artist residency', value: 'Dedicated project time, facilities, mentoring, public presentation, or program-specific funding',
    rows: [
      ['harvestworks-artist-residency','Harvestworks Digital Media Arts Center','Artists-in-Residence Program','https://www.harvestworks.org/open-call-2026-artists-in-residence-program/'],
      ['emap-media-art-residencies','European Media Art Platform','EMAP Residencies','https://call.emare.eu/'],
      ['public-art-futures-lab-residency','Fulton County Arts and Culture','Public Art Futures Lab Residency','https://fultoncountyga.gov/News/2026/01/07/Call-for-2026-Artists-in-Residence-at-the-Public-Art-Futures-Lab'],
      ['calarts-reef-residency','CalArts','The Reef Residency','https://calarts.edu/reef/apply-reef-residency'],
      ['hopecat-artist-residency','Hope Center for Arts and Technology','Resident Artist Program','https://www.hopecat.org/ra.html'],
      ['kala-art-residencies','Kala Art Institute','Artist-in-Residence Program','https://www.kala.org/residencies/'],
      ['archie-bray-residency','Archie Bray Foundation','Artist Residency Program','https://archiebray.org/residencies/apply/'],
      ['eyebeam-residency','Eyebeam','Eyebeam Fellowship and Residency','https://www.eyebeam.org/programs/'],
      ['new-inc-residency','New Museum','NEW INC','https://www.newinc.org/apply'],
      ['banff-centre-artist-residencies','Banff Centre for Arts and Creativity','Artist Residencies','https://www.banffcentre.ca/programs'],
    ] as Row[],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title,
    category: 'internships-work-experience', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.label} administered by ${provider}.`,
    eligibility: 'Applicants must meet the current career-stage, affiliation, location, availability, work-authorization, and application requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated work-experience opportunities.`);
