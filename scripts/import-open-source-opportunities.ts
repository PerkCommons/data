import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['contributor-programs', 'mentorship-programs'], tags: ['contributors', 'mentorship'],
    description: 'an official newcomer or contributor pathway with community guidance and mentoring resources',
    value: 'Contributor onboarding, community guidance, mentored tasks, and practical open-source experience',
    rows: [
      ['apache-community-development', 'Apache Software Foundation', 'Community Development Newcomer Resources', 'https://community.apache.org/newbiefaq.html'],
      ['eclipse-contributor-resources', 'Eclipse Foundation', 'Contributor Resources', 'https://www.eclipse.org/contribute/'],
      ['fedora-join-sig', 'Fedora Project', 'Fedora Join Special Interest Group', 'https://docs.fedoraproject.org/en-US/fedora-join/'],
      ['gnome-newcomers', 'GNOME Foundation', 'GNOME Newcomers Guide', 'https://welcome.gnome.org/'],
      ['kde-get-involved', 'KDE Community', 'Get Involved with KDE', 'https://community.kde.org/Get_Involved'],
      ['libreoffice-mentoring', 'The Document Foundation', 'LibreOffice Mentoring', 'https://www.libreoffice.org/community/get-involved/'],
      ['openstack-first-contact-sig', 'OpenInfra Foundation', 'OpenStack First Contact SIG', 'https://wiki.openstack.org/wiki/First_Contact_SIG'],
      ['debian-outreach', 'Debian Project', 'Debian Outreach', 'https://wiki.debian.org/Teams/Outreach'],
      ['openmrs-contributor-guide', 'OpenMRS', 'Contributor Guide', 'https://openmrs.org/get-involved/'],
      ['chaoss-newcomers', 'CHAOSS', 'Newcomer Community', 'https://chaoss.community/participate/'],
    ],
  },
  {
    subcategories: ['maintainer-programs', 'infrastructure-support'], tags: ['maintainers', 'infrastructure'],
    description: 'an infrastructure-support program or free service tier specifically available to qualifying open-source projects',
    value: 'Hosted infrastructure, testing, documentation, search, observability, or delivery support for open-source maintainers',
    rows: [
      ['fastly-fast-forward', 'Fastly', 'Fast Forward Program', 'https://www.fastly.com/fast-forward'],
      ['browserstack-open-source', 'BrowserStack', 'Open Source Program', 'https://www.browserstack.com/open-source'],
      ['sauce-labs-open-sauce', 'Sauce Labs', 'Open Sauce Program', 'https://saucelabs.com/resources/blog/announcing-open-sauce-free-unlimited-testing-for-open-source-projects'],
      ['gitbook-open-source', 'GitBook', 'Open Source Program', 'https://www.gitbook.com/solutions/open-source'],
      ['read-the-docs-community', 'Read the Docs', 'Community Hosting', 'https://about.readthedocs.com/'],
      ['codecov-open-source', 'Codecov', 'Open Source Coverage', 'https://about.codecov.io/for/open-source/'],
      ['sonarcloud-open-source', 'Sonar', 'SonarQube Cloud for Open Source', 'https://www.sonarsource.com/open-source-editions/'],
      ['algolia-open-source', 'Algolia', 'Open Source Program', 'https://www.algolia.com/for-open-source/'],
      ['coveralls-open-source', 'Coveralls', 'Open Source Coverage', 'https://coveralls.io/'],
      ['macstadium-oss-program', 'MacStadium', 'Open Source Program', 'https://macstadium.com/company/opensource'],
    ],
  },
  {
    subcategories: ['sponsorships', 'fiscal-hosting', 'project-grants'], tags: ['fiscal-hosting', 'project-support'],
    description: 'an open-source project home or fiscal-hosting pathway that provides organizational, financial, or administrative support',
    value: 'Fiscal stewardship, legal or administrative support, fundraising infrastructure, and project governance services',
    rows: [
      ['numfocus-fiscal-sponsorship', 'NumFOCUS', 'Fiscal Sponsorship', 'https://numfocus.org/projects-overview'],
      ['software-freedom-conservancy-projects', 'Software Freedom Conservancy', 'Member Project Program', 'https://sfconservancy.org/projects/apply/'],
      ['software-in-public-interest-projects', 'Software in the Public Interest', 'Associated Project Program', 'https://www.spi-inc.org/projects/associated-project-howto/'],
      ['open-collective-europe-hosting', 'Open Collective Europe', 'Fiscal Hosting', 'https://opencollective.com/europe'],
      ['commons-conservancy-programmes', 'Commons Conservancy', 'Programme Hosting', 'https://commonsconservancy.org/programmes/'],
      ['code-shelter-projects', 'Code Shelter', 'Project Shelter', 'https://www.codeshelter.co/'],
      ['linux-foundation-project-hosting', 'Linux Foundation', 'Project Hosting', 'https://www.linuxfoundation.org/projects/hosting'],
      ['apache-incubator', 'Apache Software Foundation', 'Apache Incubator', 'https://incubator.apache.org/'],
      ['eclipse-project-proposals', 'Eclipse Foundation', 'New Project Proposals', 'https://www.eclipse.org/projects/handbook/#starting'],
      ['cncf-sandbox-projects', 'Cloud Native Computing Foundation', 'Sandbox Project Applications', 'https://github.com/cncf/sandbox'],
    ],
  },
  {
    subcategories: ['issue-bounties', 'project-grants'], tags: ['bounties', 'funding'],
    description: 'a bounty or open funding platform where eligible open-source work can receive financial rewards',
    value: 'Issue-level rewards, project funding, or community-backed grants for completed open-source work',
    rows: [
      ['algora-bounties', 'Algora', 'Open Source Bounties', 'https://algora.io/'],
      ['gitcoin-grants', 'Gitcoin', 'Gitcoin Grants', 'https://grants.gitcoin.co/'],
      ['onlydust-contributor-rewards', 'OnlyDust', 'Open Source Contributor Rewards', 'https://www.onlydust.com/'],
      ['code4rena-audit-contests', 'Code4rena', 'Open Security Audit Contests', 'https://code4rena.com/'],
      ['huntr-ai-bounties', 'Protect AI', 'Huntr AI/ML Bug Bounties', 'https://huntr.com/'],
      ['immunefi-bug-bounties', 'Immunefi', 'Open Source Bug Bounties', 'https://immunefi.com/bug-bounty/'],
      ['open-bug-bounty', 'Open Bug Bounty', 'Coordinated Vulnerability Bounties', 'https://www.openbugbounty.org/'],
      ['opensourcepledge-maintainer-fund', 'Open Source Pledge', 'Maintainer Fund', 'https://opensourcepledge.com/'],
      ['internet-bug-bounty', 'HackerOne', 'Internet Bug Bounty', 'https://hackerone.com/ibb'],
      ['alpha-omega-open-source-security', 'OpenSSF Alpha-Omega', 'Open Source Security Funding', 'https://alpha-omega.dev/'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'open-source', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Projects or contributors must meet the current open-source license, governance, activity, location, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated open-source opportunities.`);
