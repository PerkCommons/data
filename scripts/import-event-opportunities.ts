import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['conference-scholarships', 'travel-grants', 'community-tickets', 'student-tickets'],
    tags: ['conference-support', 'students'],
    description: 'a conference attendance-support program offering registration, travel support, or student volunteer benefits under current terms',
    value: 'Reduced-cost or supported conference participation, with program-specific registration and travel benefits',
    rows: [
      ['pycon-us-financial-aid', 'Python Software Foundation', 'PyCon US Financial Aid', 'https://us.pycon.org/2026/attend/information/'],
      ['kubecon-diversity-scholarship', 'Cloud Native Computing Foundation', 'KubeCon + CloudNativeCon Diversity Scholarship', 'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/attend/diversity-scholarships/'],
      ['open-source-summit-scholarships', 'Linux Foundation', 'Open Source Summit Diversity Scholarships', 'https://events.linuxfoundation.org/open-source-summit-north-america/attend/diversity-scholarships/'],
      ['siggraph-student-volunteers', 'ACM SIGGRAPH', 'Student Volunteer Program', 'https://s2026.siggraph.org/program/student-volunteers/'],
      ['supercomputing-student-volunteers', 'SC Conference', 'Student Volunteers Program', 'https://sc26.supercomputing.org/students/student-volunteers/'],
      ['neurips-volunteer-program', 'NeurIPS Foundation', 'Student Author Financial Aid', 'https://neurips.cc/Conferences/2026/MainTrackHandbook'],
      ['icml-volunteer-program', 'International Conference on Machine Learning', 'ICML Volunteer and Financial Aid Program', 'https://icml.cc/Conferences/2026/FinancialAid'],
      ['chi-student-volunteers', 'ACM CHI Conference', 'Student Volunteer Program', 'https://chi2026.acm.org/2025/10/16/call-for-svs/'],
      ['tapia-conference-scholarships', 'CMD-IT', 'Tapia Conference Scholarships', 'https://tapiaconference.cmd-it.org/participate/scholarships/'],
      ['euro-python-financial-aid', 'EuroPython Society', 'EuroPython Financial Aid', 'https://ep2026.europython.eu/finaid/'],
    ],
  },
  {
    subcategories: ['speaker-opportunities', 'networking-events'], tags: ['call-for-proposals', 'conferences'],
    description: 'a professional or community conference with an open call for speakers and participant networking',
    value: 'A public speaking pathway, audience reach, peer exchange, and conference networking',
    rows: [
      ['fosdem-call-for-participation', 'FOSDEM', 'Call for Participation', 'https://fosdem.org/2026/news/2025-09-21-call-for-participation/'],
      ['all-things-open-call-for-talks', 'All Things Open', 'Conference Speaker Program', 'https://allthingsopen.org/'],
      ['europython-call-for-proposals', 'EuroPython Society', 'Call for Proposals', 'https://ep2026.europython.eu/cfp/'],
      ['kubecon-call-for-proposals', 'Cloud Native Computing Foundation', 'KubeCon + CloudNativeCon Call for Proposals', 'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/cfp/'],
      ['pycon-us-call-for-proposals', 'Python Software Foundation', 'PyCon US Call for Proposals', 'https://us.pycon.org/2026/speaking/'],
      ['react-conf-call-for-speakers', 'React', 'React Conf Call for Speakers', 'https://conf.react.dev/'],
      ['jsconf-call-for-speakers', 'JSConf', 'JSConf Call for Speakers', 'https://jsconf.com/'],
      ['gophercon-call-for-speakers', 'GopherCon', 'GopherCon Speaker Program', 'https://www.gophercon.com/'],
      ['postgresql-conference-cfp', 'PostgreSQL Community', 'PostgreSQL Conference Calls for Papers', 'https://www.postgresql.org/about/events/'],
      ['devconf-call-for-proposals', 'DevConf', 'DevConf Call for Proposals', 'https://www.devconf.info/'],
    ],
  },
  {
    subcategories: ['startup-showcases', 'demo-days', 'networking-events'], tags: ['startups', 'showcase'],
    description: 'a startup event program that offers selected companies exhibition, showcase, demo, or investor-networking access',
    value: 'Startup visibility, product demonstrations, investor or partner meetings, and event networking',
    rows: [
      ['web-summit-alpha', 'Web Summit', 'ALPHA Startup Programme', 'https://websummit.com/startups/'],
      ['vivatech-startup-program', 'Viva Technology', 'Startup Program', 'https://vivatechnology.com/startups'],
      ['four-yfn-startup-program', '4YFN', 'Startup Program', 'https://www.4yfn.com/'],
      ['gitex-expand-north-star', 'GITEX GLOBAL', 'Expand North Star', 'https://www.expandnorthstar.com/'],
      ['startup-grind-global-startups', 'Startup Grind', 'Global Conference Startup Program', 'https://www.startupgrind.com/conference/'],
      ['tnw-for-startups', 'TNW Conference', 'TNW for Startups', 'https://thenextweb.com/conference/startups'],
      ['saastr-startup-program', 'SaaStr', 'SaaStr Startup Program', 'https://www.saastrannual.com/startups'],
      ['london-tech-week-startup-program', 'London Tech Week', 'Startup Program', 'https://londontechweek.com/startups'],
      ['dublin-tech-summit-startups', 'Dublin Tech Summit', 'Startup Program', 'https://dublintechsummit.tech/startups/'],
      ['hello-tomorrow-summit-startups', 'Hello Tomorrow', 'Global Summit Startup Participation', 'https://hello-tomorrow.org/global-summit/'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'events-conferences', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Applicants must meet the current event, role, age, location, deadline, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated event and conference opportunities.`);
