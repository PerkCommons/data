import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['skilled-volunteering', 'nonprofit-projects', 'pro-bono-work', 'remote-volunteering'],
    tags: ['skills-based-volunteering', 'nonprofits'],
    description: 'a skills-based volunteering platform or program that matches professionals with nonprofit projects',
    value: 'Remote or flexible pro bono projects that apply professional skills to nonprofit needs',
    rows: [
      ['unv-online-volunteering', 'United Nations Volunteers', 'Online Volunteering', 'https://www.unv.org/become-online-volunteer'],
      ['volunteermatch-virtual', 'VolunteerMatch', 'Virtual Volunteer Opportunities', 'https://www.volunteermatch.org/virtual-volunteering'],
      ['idealist-volunteer', 'Idealist', 'Volunteer Opportunities', 'https://www.idealist.org/en/volunteer'],
      ['skills-for-change-volunteer', 'Skills for Change', 'Skills-Based Volunteering', 'https://www.skillsforchange.org/volunteer/'],
      ['goodera-volunteering', 'Goodera', 'Virtual Skills-Based Volunteering', 'https://www.goodera.com/en-gb/blog/virtual-skills-based-volunteering'],
      ['develop-for-good', 'Develop for Good', 'Nonprofit Technology Projects', 'https://www.developforgood.org/'],
      ['statistics-without-borders', 'Statistics Without Borders', 'Volunteer Projects', 'https://www.statisticswithoutborders.org/'],
      ['translators-without-borders', 'CLEAR Global', 'Translators without Borders Platform', 'https://twbplatform.org/'],
      ['movingworlds-experteering', 'MovingWorlds', 'Experteering', 'https://movingworlds.org/experteering'],
      ['social-coder', 'Social Coder', 'Volunteer Software Projects', 'https://socialcoder.org/'],
    ],
  },
  {
    subcategories: ['civic-volunteering', 'community-service', 'remote-volunteering'],
    tags: ['civic-service', 'community'],
    description: 'a civic or community-service volunteer program with current opportunities',
    value: 'Structured service, community impact, training, and role-specific volunteer support',
    rows: [
      ['americorps-volunteer', 'AmeriCorps', 'Volunteer and Service Opportunities', 'https://americorps.gov/serve/fit-finder'],
      ['peace-corps-volunteer', 'Peace Corps', 'Volunteer Programs', 'https://www.peacecorps.gov/volunteer/'],
      ['us-digital-response-volunteer', 'US Digital Response', 'Volunteer', 'https://www.usdigitalresponse.org/volunteer'],
      ['code-for-america-brigade-network', 'Code for America', 'Brigade Network', 'https://codeforamerica.org/programs/network/'],
      ['democracy-lab-volunteer', 'DemocracyLab', 'Volunteer for Civic Tech Projects', 'https://www.democracylab.org/projects'],
      ['crisis-text-line-volunteer', 'Crisis Text Line', 'Volunteer Crisis Counselor', 'https://www.crisistextline.org/become-a-volunteer/'],
      ['zooniverse-volunteer', 'Zooniverse', 'People-Powered Research Projects', 'https://www.zooniverse.org/projects'],
      ['smithsonian-digital-volunteers', 'Smithsonian Institution', 'Digital Volunteers', 'https://transcription.si.edu/'],
      ['missing-maps', 'Missing Maps', 'Humanitarian Mapping', 'https://www.missingmaps.org/'],
      ['openstreetmap-humanitarian-mapping', 'Humanitarian OpenStreetMap Team', 'Volunteer Mapping', 'https://www.hotosm.org/volunteer/'],
    ],
  },
  {
    subcategories: ['open-source-volunteering', 'mentorship-volunteering', 'skilled-volunteering', 'remote-volunteering'],
    tags: ['open-source', 'mentoring'],
    description: 'an open-source, coding, or digital-skills community that invites volunteers to contribute or mentor others',
    value: 'Contributor experience, community impact, mentoring practice, and reusable open work',
    rows: [
      ['codetriage-volunteer', 'CodeTriage', 'Open Source Contribution', 'https://www.codetriage.com/'],
      ['exercism-mentors', 'Exercism', 'Volunteer Mentoring', 'https://exercism.org/mentoring'],
      ['codebar-coaches', 'codebar', 'Volunteer Coaching', 'https://codebar.io/coaches'],
      ['coderdojo-volunteers', 'CoderDojo', 'Volunteer', 'https://coderdojo.com/en/volunteer/'],
      ['code-club-volunteers', 'Raspberry Pi Foundation', 'Code Club Volunteer', 'https://codeclub.org/en'],
      ['mozilla-contributors', 'Mozilla', 'Contribute to Mozilla', 'https://www.mozilla.org/en-US/contribute/'],
      ['debian-mentors', 'Debian', 'Debian Mentors', 'https://mentors.debian.net/intro-maintainers/'],
      ['drupal-mentoring', 'Drupal', 'Contributor Mentoring', 'https://www.drupal.org/community/mentoring'],
      ['wordpress-contributor-teams', 'WordPress', 'Contributor Teams', 'https://make.wordpress.org/'],
      ['openstreetmap-contributors', 'OpenStreetMap', 'Contribute to OpenStreetMap', 'https://www.openstreetmap.org/help'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'volunteer-service', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Volunteers must meet the current age, location, skills, availability, screening, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated volunteer and service opportunities.`);
