import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['mentorship-programs', 'office-hours', 'expert-networks'], tags: ['mentorship', 'expert-guidance'],
    description: 'a mentorship network where eligible members can request individual guidance or expert sessions',
    value: 'One-to-one mentoring, expert guidance, and scheduled advice sessions',
    rows: [
      ['adplist-mentorship', 'ADPList', 'Free Mentorship Sessions', 'https://adplist.org/'],
      ['micromentor', 'MicroMentor', 'Business Mentoring', 'https://www.micromentor.org/'],
      ['score-business-mentoring', 'SCORE', 'Free Business Mentoring', 'https://www.score.org/find-mentor'],
      ['mentoring-club', 'The Mentoring Club', 'Free Mentoring', 'https://www.mentoring-club.com/'],
      ['pushfar-mentoring', 'PushFar', 'Open Mentoring Network', 'https://www.pushfar.com/how-it-works/'],
      ['techwomen-mentoring', 'TechWomen', 'TechWomen Professional Mentorship', 'https://www.techwomen.org/'],
      ['anitab-org-mentorship', 'AnitaB.org', 'Mentorship Programs', 'https://anitab.org/'],
      ['rewriting-code-mentoring', 'Rewriting the Code', 'Mentoring Programs', 'https://rewritingthecode.org/'],
      ['built-by-girls-wave', 'BUILT BY GIRLS', 'WAVE Mentorship Program', 'https://www.builtbygirls.com/wave'],
      ['coding-coach-mentorship', 'Coding Coach', 'Free Software Engineering Mentorship', 'https://codingcoach.io/'],
    ],
  },
  {
    subcategories: ['founder-communities', 'peer-communities', 'expert-networks'], tags: ['founders', 'peer-support'],
    description: 'a founder community offering peer learning, connections, and access to experienced operators',
    value: 'Founder peer support, practical knowledge sharing, introductions, and community events',
    rows: [
      ['indie-hackers-community', 'Indie Hackers', 'Founder Community', 'https://www.indiehackers.com/'],
      ['startup-grind-community', 'Startup Grind', 'Global Startup Community', 'https://www.startupgrind.com/'],
      ['founders-network', 'Founders Network', 'Founder Peer Mentorship', 'https://foundersnetwork.com/'],
      ['f6s-founder-community', 'F6S', 'Founder Community', 'https://www.f6s.com/'],
      ['startup-genome-community', 'Startup Genome', 'Global Startup Ecosystem Community', 'https://startupgenome.com/'],
      ['entrepreneurs-organization', "Entrepreneurs' Organization", 'Entrepreneur Peer Community', 'https://hub.eonetwork.org/'],
      ['founder-university-community', 'Founder University', 'Founder University Community', 'https://www.founder.university/'],
      ['saas-alliance-community', 'SaaS Alliance', 'SaaS Founder Community', 'https://www.saasalliance.io/'],
      ['startup-school-community', 'Y Combinator', 'Startup School Community', 'https://www.startupschool.org/'],
      ['product-hunt-makers', 'Product Hunt', 'Maker Community', 'https://www.producthunt.com/launch'],
    ],
  },
  {
    subcategories: ['student-communities', 'peer-communities'], tags: ['students', 'community'],
    description: 'a student-focused peer community for learning, building projects, and professional connection',
    value: 'Peer support, events, projects, leadership opportunities, and career-oriented community resources',
    rows: [
      ['google-developer-groups-on-campus', 'Google for Developers', 'Google Developer Groups on Campus', 'https://developers.google.com/community/gdsc'],
      ['microsoft-learn-student-ambassadors', 'Microsoft', 'Microsoft Learn Student Ambassadors', 'https://mvp.microsoft.com/studentambassadors'],
      ['aws-cloud-clubs', 'Amazon Web Services', 'AWS Cloud Clubs', 'https://aws.amazon.com/developer/community/students/cloudclubs/'],
      ['hack-club', 'Hack Club', 'Hack Club', 'https://hackclub.com/'],
      ['colorstack-community', 'ColorStack', 'Student Community', 'https://www.colorstack.org/'],
      ['acm-student-chapters', 'Association for Computing Machinery', 'ACM Student Chapters', 'https://www.acm.org/chapters/students'],
      ['code2040-community', 'Code2040', 'Black and Latinx Tech Community', 'https://www.code2040.org/'],
      ['mlh-community', 'Major League Hacking', 'MLH Community', 'https://mlh.io/'],
      ['code-club-community', 'Raspberry Pi Foundation', 'Code Club', 'https://codeclub.org/'],
      ['ieee-students-community', 'IEEE', 'IEEE Students Community', 'https://students.ieee.org/'],
    ],
  },
  {
    subcategories: ['technical-communities', 'peer-communities', 'expert-networks'], tags: ['developers', 'technical-community'],
    description: 'an official technical community with local or online groups, knowledge sharing, and access to experienced practitioners',
    value: 'Technical events, peer support, practitioner knowledge, and collaboration opportunities',
    rows: [
      ['google-developer-groups', 'Google for Developers', 'Google Developer Groups', 'https://developers.google.com/community/gdg'],
      ['aws-user-groups', 'Amazon Web Services', 'AWS User Groups', 'https://aws.amazon.com/developer/community/usergroups/'],
      ['microsoft-tech-community', 'Microsoft', 'Microsoft Tech Community', 'https://techcommunity.microsoft.com/'],
      ['cncf-community-groups', 'Cloud Native Computing Foundation', 'Cloud Native Community Groups', 'https://community.cncf.io/'],
      ['python-user-groups', 'Python Software Foundation', 'Python Community', 'https://www.python.org/community/'],
      ['rust-user-groups', 'Rust Foundation', 'Rust Community', 'https://www.rust-lang.org/community'],
      ['docker-community', 'Docker', 'Docker Community', 'https://www.docker.com/community/'],
      ['postman-community', 'Postman', 'Postman Community', 'https://www.postman.com/community/'],
      ['grafana-community', 'Grafana Labs', 'Grafana Community', 'https://grafana.com/community/'],
      ['kubernetes-community', 'Kubernetes', 'Kubernetes Community', 'https://kubernetes.io/community/'],
    ],
  },
  {
    subcategories: ['accountability-groups', 'peer-communities'], tags: ['accountability', 'coworking'],
    description: 'a structured peer-accountability or facilitated focus community',
    value: 'Scheduled focus sessions, peer accountability, and a supportive community routine',
    rows: [
      ['focusmate', 'Focusmate', 'Virtual Coworking Community', 'https://www.focusmate.com/'],
      ['flow-club', 'Flow Club', 'Virtual Coworking Sessions', 'https://www.flow.club/'],
      ['caveday', 'Caveday', 'Facilitated Focus Sessions', 'https://www.caveday.org/'],
      ['groove-coworking', 'Groove', 'Digital Coworking Community', 'https://www.groove.ooo/'],
      ['shut-up-write', 'Shut Up & Write', 'Writing Accountability Groups', 'https://shutupwrite.com/'],
      ['london-writers-salon', "London Writers' Salon", "Writers' Hour", 'https://writershour.com/'],
      ['study-together', 'Study Together', 'Online Study Community', 'https://www.studytogether.com/'],
      ['pipewing-accountability', 'Pipewing', 'Virtual Coworking Accountability', 'https://pipewing.com/'],
      ['deepwrk', 'Deepwrk', 'Virtual Body-Doubling Sessions', 'https://www.deepwrk.io/'],
      ['studystream-focus-rooms', 'StudyStream', 'Virtual Focus Rooms', 'https://www.studystream.live/'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'mentorship-community', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Participants must meet the current membership, age, location, profession, conduct, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated mentorship and community opportunities.`);
