import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups = [
  {
    subcategories: ['online-hackathons', 'innovation-challenges'],
    tags: ['hackathon', 'innovation'],
    description: (title: string, provider: string) => `${title} is an online-accessible challenge from ${provider} where participants build or propose solutions to defined technical or social problems.`,
    value: 'Challenge participation, recognition, and program-specific prizes or support',
    rows: [
      ['mlh-global-hack-week','Major League Hacking','Global Hack Week','https://ghw.mlh.io/'],
      ['nasa-space-apps-challenge','NASA','International Space Apps Challenge','https://www.spaceappschallenge.org/'],
      ['ibm-call-for-code','IBM and David Clark Cause','Call for Code','https://developer.ibm.com/callforcode/'],
      ['microsoft-imagine-cup','Microsoft','Imagine Cup','https://imaginecup.microsoft.com/'],
      ['hackster-io-contests','Hackster.io','Hackster Contests','https://www.hackster.io/contests'],
      ['devpost-online-hackathons','Devpost','Online Hackathons','https://devpost.com/hackathons'],
      ['ethglobal-hackathons','ETHGlobal','ETHGlobal Hackathons','https://ethglobal.com/events'],
      ['united-nations-datathon','United Nations Statistics Division','UN Datathon','https://unstats.un.org/bigdata/events/'],
      ['herox-innovation-challenges','HeroX','HeroX Innovation Challenges','https://www.herox.com/'],
      ['challenge-gov-innovation-challenges','U.S. General Services Administration','Challenge.gov','https://www.challenge.gov/'],
    ] as Row[],
  },
  {
    subcategories: ['in-person-hackathons', 'student-competitions'],
    tags: ['hackathon', 'students'],
    description: (title: string, provider: string) => `${title} is a recurring student hackathon organized by ${provider}, bringing eligible participants together to build projects during an intensive event.`,
    value: 'Team-building event, mentoring, project showcase, and event-specific prizes',
    rows: [
      ['hackmit','MIT','HackMIT','https://hackmit.org/'],
      ['pennapps','University of Pennsylvania','PennApps','https://pennapps.com/'],
      ['treehacks','Stanford University','TreeHacks','https://www.treehacks.com/'],
      ['hack-the-north','University of Waterloo','Hack the North','https://hackthenorth.com/'],
      ['nwhacks','nwPlus','nwHacks','https://www.nwplus.io/nwhacks'],
      ['cal-hacks','Cal Hacks','Cal Hacks','https://calhacks.io/'],
      ['hack-princeton','Princeton University','HackPrinceton','https://www.hackprinceton.com/'],
      ['hack-illinois','University of Illinois Urbana-Champaign','HackIllinois','https://hackillinois.org/'],
      ['hackduke-code-for-good','HackDuke','Code for Good','https://hackduke.org/events'],
      ['vandyhacks','VandyHacks','VandyHacks','https://vandyhacks.org/'],
    ] as Row[],
  },
  {
    subcategories: ['startup-competitions', 'pitch-competitions'],
    tags: ['startups', 'pitch'],
    description: (title: string, provider: string) => `${title} is a startup competition from ${provider} in which selected founders pitch their ventures to judges, investors, or a conference audience.`,
    value: 'Pitch exposure and competition-specific funding, prizes, or investor access',
    rows: [
      ['techcrunch-startup-battlefield','TechCrunch','Startup Battlefield','https://techcrunch.com/startup-battlefield/'],
      ['web-summit-pitch','Web Summit','PITCH','https://websummit.com/startups/pitch/'],
      ['slush-100','Slush','Slush 100','https://slush.org/audience/startups/startups'],
      ['sxsw-pitch','SXSW','SXSW Pitch','https://sxsw.com/pitch/'],
      ['startup-world-cup','Pegasus Tech Ventures','Startup World Cup','https://www.startupworldcup.io/'],
      ['entrepreneurship-world-cup','Global Entrepreneurship Network','Entrepreneurship World Cup','https://www.genglobal.org/ewc'],
      ['seedstars-world-competition','Seedstars','Seedstars World Competition','https://www.seedstars.com/community/entrepreneurs/'],
      ['rice-business-plan-competition','Rice Alliance for Technology and Entrepreneurship','Rice Business Plan Competition','https://rbpc.rice.edu/'],
      ['south-summit-startup-competition','South Summit','Startup Competition','https://www.southsummit.io/startup-competition/'],
      ['hello-tomorrow-global-challenge','Hello Tomorrow','Global Challenge','https://hello-tomorrow.org/global-challenge/'],
    ] as Row[],
  },
  {
    subcategories: ['online-hackathons', 'data-science-competitions'],
    tags: ['data-science', 'online'],
    description: (title: string, provider: string) => `${title} provides online data-science, machine-learning, or algorithmic challenges through ${provider}.`,
    value: 'Challenge datasets, benchmarking, community participation, and competition-specific prizes',
    rows: [
      ['kaggle-competitions','Kaggle','Kaggle Competitions','https://www.kaggle.com/competitions'],
      ['drivendata-competitions','DrivenData','DrivenData Competitions','https://www.drivendata.org/competitions/'],
      ['zindi-challenges','Zindi','Zindi Challenges','https://zindi.africa/competitions'],
      ['aicrowd-challenges','AIcrowd','AIcrowd Challenges','https://www.aicrowd.com/challenges'],
      ['topcoder-data-science-challenges','Topcoder','Data Science Challenges','https://www.topcoder.com/challenges'],
      ['numerai-tournament','Numerai','Numerai Tournament','https://numer.ai/tournament'],
      ['datacamp-competitions','DataCamp','Data Science Competitions','https://www.datacamp.com/competitions'],
      ['codabench-competitions','Université Paris-Saclay','Codabench Competitions','https://www.codabench.org/competitions/'],
      ['neural-information-processing-systems-competitions','NeurIPS','NeurIPS Competitions','https://neurips.cc/Conferences/2026/CallForCompetitions'],
      ['nasa-tournament-lab','NASA','NASA Tournament Lab Challenges','https://www.nasa.gov/nasa-tournament-lab/'],
    ] as Row[],
  },
  {
    subcategories: ['design-competitions'],
    tags: ['design', 'awards'],
    description: (title: string, provider: string) => `${title} is a recurring design competition from ${provider} that accepts work under its current disciplines and entry rules.`,
    value: 'Jury review, recognition, showcase, and competition-specific awards',
    rows: [
      ['core77-design-awards','Core77','Core77 Design Awards','https://designawards.core77.com/'],
      ['red-dot-award-design-concept','Red Dot','Red Dot Award: Design Concept','https://www.red-dot.org/design-concept'],
      ['if-design-student-award','iF Design','iF Design Student Award','https://ifdesign.com/en/if-design-student-award'],
      ['ux-design-awards-new-talent','International Design Center Berlin','UX Design Awards New Talent','https://ux-design-awards.com/enter'],
      ['a-design-award','A\' Design Award and Competition','A\' Design Award','https://competition.adesignaward.com/'],
      ['pentawards','Pentawards','Pentawards Competition','https://pentawards.com/live/en/page/competition'],
      ['dezeen-awards','Dezeen','Dezeen Awards','https://www.dezeen.com/awards/'],
      ['dandad-new-blood-awards','D&AD','New Blood Awards','https://www.dandad.org/en/d-ad-new-blood-awards/'],
      ['rsa-student-design-awards','Royal Society of Arts','Student Design Awards','https://www.thersa.org/student-design-awards'],
      ['andreu-world-design-contest','Andreu World','International Design Contest','https://andreuworld.com/en/talent/design-contest'],
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
      category: 'competitions-hackathons',
      subcategories: group.subcategories,
      tags: group.tags,
      description: group.description(title, provider),
      eligibility: 'Participants must meet the current age, location, team, entry, conduct, intellectual-property, and deadline requirements.',
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
console.log(`Wrote ${count} curated competition opportunities.`);
