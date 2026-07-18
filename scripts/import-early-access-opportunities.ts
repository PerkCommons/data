import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['public-betas', 'product-testing'], tags: ['beta', 'product-testing'],
    description: 'an official public beta channel that lets participants test prerelease product builds and provide feedback',
    value: 'Early product access, prerelease testing, and a supported feedback channel',
    rows: [
      ['apple-beta-software-program', 'Apple', 'Apple Beta Software Program', 'https://beta.apple.com/'],
      ['android-beta-program', 'Google', 'Android Beta Program', 'https://www.google.com/android/beta'],
      ['chrome-beta-channel', 'Google', 'Chrome Beta Channel', 'https://www.google.com/chrome/beta/'],
      ['firefox-beta', 'Mozilla', 'Firefox Beta', 'https://www.mozilla.org/firefox/channel/desktop/'],
      ['microsoft-edge-insider', 'Microsoft', 'Microsoft Edge Insider Channels', 'https://www.microsoft.com/edge/download/insider'],
      ['steam-client-beta', 'Valve', 'Steam Client Beta', 'https://help.steampowered.com/en/faqs/view/276C-85A0-C531-AFA3'],
      ['playstation-beta-program', 'Sony Interactive Entertainment', 'PlayStation Beta Program', 'https://www.playstation.com/beta-program-at-playstation/'],
      ['xbox-insider-program', 'Microsoft', 'Xbox Insider Program', 'https://www.xbox.com/en-US/legal/insider-program'],
      ['brave-beta', 'Brave Software', 'Brave Beta', 'https://brave.com/download-beta/'],
      ['raspberry-pi-os-testing', 'Raspberry Pi', 'Raspberry Pi OS Testing', 'https://www.raspberrypi.com/software/operating-systems/'],
    ],
  },
  {
    subcategories: ['developer-previews', 'research-previews'], tags: ['developer-preview', 'experimental'],
    description: 'an official preview channel for developers evaluating experimental APIs, tools, platforms, or technical capabilities',
    value: 'Prerelease technical access, documentation, compatibility testing, and structured feedback opportunities',
    rows: [
      ['google-workspace-developer-preview', 'Google', 'Google Workspace Developer Preview Program', 'https://developers.google.com/workspace/preview'],
      ['jetbrains-early-access-program', 'JetBrains', 'Early Access Program', 'https://www.jetbrains.com/resources/eap/'],
      ['unity-beta-program', 'Unity Technologies', 'Unity Beta Program', 'https://unity.com/releases/editor/beta'],
      ['docker-desktop-beta', 'Docker', 'Docker Desktop Beta Releases', 'https://docs.docker.com/desktop/release-notes/'],
      ['github-public-preview', 'GitHub', 'GitHub Public Previews', 'https://docs.github.com/en/get-started/using-github/exploring-early-access-releases-with-feature-preview'],
      ['aws-preview-terms', 'Amazon Web Services', 'AWS Preview Services', 'https://aws.amazon.com/service-terms/'],
      ['google-cloud-preview', 'Google Cloud', 'Google Cloud Preview Offerings', 'https://cloud.google.com/products#product-launch-stages'],
      ['azure-preview-features', 'Microsoft Azure', 'Azure Preview Features', 'https://azure.microsoft.com/support/legal/preview-supplemental-terms/'],
      ['cloudflare-beta-features', 'Cloudflare', 'Cloudflare Workers Betas', 'https://developers.cloudflare.com/workers/platform/betas/'],
      ['stripe-preview-features', 'Stripe', 'Stripe Preview Features', 'https://docs.stripe.com/release-phases'],
    ],
  },
  {
    subcategories: ['private-betas', 'waitlists'], tags: ['private-beta', 'application'],
    description: 'an official application, prerelease, or invitation channel through which selected participants may test unreleased capabilities',
    value: 'Potential invitation to private testing, direct product feedback, and prerelease feature access',
    rows: [
      ['adobe-prerelease-program', 'Adobe', 'Adobe Prerelease Program', 'https://www.adobeprerelease.com/'],
      ['adobe-creative-cloud-beta', 'Adobe', 'Creative Cloud Beta Apps', 'https://helpx.adobe.com/creative-cloud/beta.html'],
      ['dropbox-early-access', 'Dropbox', 'Dropbox Early Access', 'https://help.dropbox.com/account-settings/advance-access'],
      ['atlassian-early-access-program', 'Atlassian', 'Atlassian Forge Early Access Program', 'https://developer.atlassian.com/platform/forge/whats-coming/'],
      ['slack-beta-program', 'Slack', 'Slack Beta Program', 'https://slack.com/help/articles/115004846068-Slack-beta-program'],
      ['microsoft-365-insider', 'Microsoft', 'Microsoft 365 Insider', 'https://insider.microsoft365.com/'],
      ['samsung-one-ui-beta', 'Samsung', 'One UI Beta Program', 'https://developer.samsung.com/one-ui-beta'],
      ['opera-beta', 'Opera', 'Opera Beta Browser', 'https://www.opera.com/computer/beta'],
      ['betatesting-tester-community', 'BetaTesting', 'BetaTesting Tester Community', 'https://betatesting.com/beta-testers'],
      ['sonos-beta-program', 'Sonos', 'Sonos Beta Program', 'https://support.sonos.com/article/sonos-beta-programs'],
    ],
  },
  {
    subcategories: ['pilot-programs', 'early-adopter-programs'], tags: ['pilot', 'early-adopter'],
    description: 'an official pilot or early-adopter pathway for organizations and developers evaluating new platform capabilities before general availability',
    value: 'Pilot access, implementation learning, product-team feedback channels, and early deployment experience',
    rows: [
      ['salesforce-pilot-beta-programs', 'Salesforce', 'Salesforce Pilot and Beta Programs', 'https://help.salesforce.com/s/articleView?id=release-notes.rn_general_pilot_beta.htm&type=5'],
      ['shopify-developer-preview', 'Shopify', 'Shopify Developer Preview', 'https://shopify.dev/docs/api/developer-previews'],
      ['mongodb-preview-features', 'MongoDB', 'MongoDB Preview Features', 'https://www.mongodb.com/docs/preview-features/'],
      ['okta-early-access', 'Okta', 'Okta Early Access Features', 'https://help.okta.com/oie/en-us/content/topics/releasenotes/early-access.htm'],
      ['twilio-beta-products', 'Twilio', 'Twilio Beta Products and Features', 'https://www.twilio.com/en-us/products/beta'],
      ['datadog-preview-features', 'Datadog', 'Datadog Preview Features', 'https://docs.datadoghq.com/account_management/rbac/permissions/?tab=datadogapplication#preview-features'],
      ['grafana-labs-experimental', 'Grafana Labs', 'Grafana Experimental Features', 'https://grafana.com/docs/release-life-cycle/'],
      ['canonical-preview-services', 'Canonical', 'Ubuntu Preview and Interim Releases', 'https://ubuntu.com/about/release-cycle'],
      ['red-hat-technology-preview', 'Red Hat', 'Red Hat Technology Preview Features', 'https://access.redhat.com/support/offerings/techpreview'],
      ['sap-beta-testing', 'SAP', 'SAP Customer Influence Programs', 'https://influence.sap.com/'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'early-access', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Access depends on the current program, account, device, geography, capacity, confidentiality, and testing requirements; preview features may be unstable.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated early-access opportunities.`);
