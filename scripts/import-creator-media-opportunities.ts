import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['creator-funds', 'design-residencies'], tags: ['artists', 'residency'],
    description: 'a funded or supported residency pathway for eligible artists, designers, and creative practitioners developing original work',
    value: 'Dedicated creation time, workspace or accommodation, peer exchange, mentorship, and program-specific financial support',
    rows: [
      ['jan-van-eyck-residency', 'Jan van Eyck Academie', 'Jan van Eyck Residency', 'https://www.janvaneyck.nl/apply'],
      ['rijksakademie-residency', 'Rijksakademie van beeldende kunsten', 'Rijksakademie Residency', 'https://www.rijksakademie.nl/en/residency/apply'],
      ['akademie-schloss-solitude-fellowship', 'Akademie Schloss Solitude', 'Solitude Fellowship', 'https://www.akademie-solitude.de/en/fellowship/solitude-fellowship/'],
      ['fabrica-residency', 'Fabrica Research Centre', 'Fabrica Residency', 'https://www.fabrica.it/'],
      ['eyebeam-fellowship', 'Eyebeam', 'Eyebeam Fellowship', 'https://www.eyebeam.org/programs/'],
      ['center-for-book-arts-residency', 'Center for Book Arts', 'Workspace Artists-in-Residence', 'https://centerforbookarts.org/opportunities/workspace-artists-in-residence'],
      ['headlands-artist-residency', 'Headlands Center for the Arts', 'Artist in Residence Program', 'https://www.headlands.org/program/air/'],
      ['bemis-center-residency', 'Bemis Center for Contemporary Arts', 'Artist-in-Residence Program', 'https://www.bemiscenter.org/residency'],
      ['ox-bow-artist-residency', 'Ox-Bow School of Art', 'Artist-in-Residence Program', 'https://www.ox-bow.org/be-a-resident'],
      ['art-omi-residencies', 'Art Omi', 'Art Omi Residencies', 'https://artomi.org/residencies/'],
    ],
  },
  {
    subcategories: ['media-fellowships', 'journalism-grants'], tags: ['journalism', 'reporting'],
    description: 'a fellowship or grant program supporting independent reporting, public-interest journalism, or media development',
    value: 'Reporting funds, editorial or research support, professional development, and publication or network access',
    rows: [
      ['investigative-journalism-europe-grants', 'Investigative Journalism for Europe', 'IJ4EU Grants', 'https://www.investigativejournalismforeu.net/grants/'],
      ['fund-for-investigative-journalism-grants', 'Fund for Investigative Journalism', 'Reporting Grants', 'https://fij.org/apply-for-a-grant/'],
      ['iwmf-reporting-opportunities', 'International Women’s Media Foundation', 'Reporting Opportunities', 'https://www.iwmf.org/our-programs/'],
      ['rory-peck-trust-assistance', 'Rory Peck Trust', 'Crisis Fund for Freelance Journalists', 'https://rorypecktrust.org/get-help/crisis/crisis-fund/'],
      ['european-journalism-centre-grants', 'European Journalism Centre', 'Journalism Grants', 'https://ejc.net/funding'],
      ['solutions-journalism-network-fellowships', 'Solutions Journalism Network', 'Fellowships and Programs', 'https://www.solutionsjournalism.org/programs'],
      ['thomson-reuters-foundation-journalism-training', 'Thomson Reuters Foundation', 'Journalism Training and Mentoring', 'https://www.trust.org/media-development/'],
      ['one-world-media-fellowship', 'One World Media', 'Global Short Docs Forum', 'https://oneworldmedia.org.uk/global-short-docs-forum/'],
      ['journalism-ai-fellowship', 'JournalismAI', 'JournalismAI Fellowship Programme', 'https://www.journalismai.info/programmes/fellowship'],
      ['pulitzer-center-rainforest-journalism-fund', 'Pulitzer Center', 'Rainforest Journalism Fund', 'https://pulitzercenter.org/rainforest-journalism-fund'],
    ],
  },
  {
    subcategories: ['podcast-grants', 'creator-funds'], tags: ['podcast', 'audio'],
    description: 'a funding or supported-development opportunity for eligible podcasts, radio work, or independent audio storytelling',
    value: 'Audio production funding, development support, training, pitching access, or distribution assistance',
    rows: [
      ['eu-audio-reporting-grant', 'European Commission', 'EU Audio Reporting Call', 'https://digital-strategy.ec.europa.eu/en/funding/call-proposals-eu-audio-reporting-0'],
      ['storyhive-video-podcast', 'TELUS STORYHIVE', 'Video Podcast Program', 'https://www.storyhive.com/en/programs/video-podcast/video-podcast-2026'],
      ['whickers-podcast-pitch', 'The Whickers and Sheffield DocFest', 'Podcast Pitch', 'https://www.sheffdocfest.com/composition/whickers-podcast-pitch'],
      ['templeton-radio-podcast-grants', 'John Templeton Foundation', 'Radio and Podcast Grants', 'https://www.templeton.org/funding-areas/podcast-grants'],
      ['braden-storytelling-grant', 'Stanford Storytelling Project', 'Braden Storytelling Grant', 'https://storytelling.stanford.edu/grants-fellowships/braden-storytelling-grant/apply-braden-grant'],
      ['climate-story-fund-audio', 'Climate Story Unit', 'Climate Story Fund', 'https://climatestoryunit.org/fund/apply/'],
      ['content-is-queen-micro-grants', 'Content is Queen', 'Micro-Grants for Podcasters', 'https://www.contentisqueen.org/grants'],
      ['neh-media-projects', 'National Endowment for the Humanities', 'Media Projects', 'https://www.neh.gov/program/media-projects'],
      ['air-new-voices-amplify', 'Association of Independents in Radio', 'New Voices AMPLIFY', 'https://airmedia.org/programs/new-voices'],
      ['podfund-audio-creators', 'Podfund', 'Podcast Creator Funding', 'https://pod.fund/'],
    ],
  },
  {
    subcategories: ['film-grants', 'creator-funds'], tags: ['film', 'documentary'],
    description: 'a selective fund supporting eligible independent film or documentary projects at specified stages of development, production, or completion',
    value: 'Project funding, creative or editorial support, industry access, and program-specific distribution resources',
    rows: [
      ['points-north-fellowship', 'Points North Institute', 'Points North Fellowship', 'https://pointsnorthinstitute.org/artist-programs/points-north-fellowship/'],
      ['ida-enterprise-documentary-fund', 'International Documentary Association', 'Enterprise Documentary Fund', 'https://www.documentary.org/enterprise/about'],
      ['chicken-egg-pictures-research-development', 'Chicken & Egg Pictures', 'Research and Development Grant', 'https://chickeneggpics.org/programs/'],
      ['sffilm-documentary-film-fund', 'SFFILM', 'Documentary Film Fund', 'https://sffilm.org/rainin-grant/'],
      ['hot-docs-blue-ice-fund', 'Hot Docs', 'Hot Docs-Blue Ice Docs Fund', 'https://hotdocs.ca/industry/film-funds'],
      ['doha-film-institute-grants', 'Doha Film Institute', 'Grants Programme', 'https://www.dohafilminstitute.com/financing/grants'],
      ['red-sea-fund', 'Red Sea Film Foundation', 'Red Sea Fund', 'https://redseafilmfest.com/en/red-sea-fund/'],
      ['pandora-short-film-grant', 'The Pandora Short Film Grant', 'Pandora Short Film Grant', 'https://pandora.org/'],
      ['southern-documentary-fund-grants', 'Southern Documentary Fund', 'Production Grants', 'https://southerndocumentaryfund.org/grants/'],
      ['screen-australia-documentary-funding', 'Screen Australia', 'Documentary Funding', 'https://www.screenaustralia.gov.au/funding-and-support/documentary'],
    ],
  },
  {
    subcategories: ['writing-programs', 'publishing-support'], tags: ['writers', 'publishing'],
    description: 'a selective writing-development program offering eligible writers workshops, mentorship, residency time, or routes toward publication',
    value: 'Craft development, editorial feedback, literary community access, and program-specific scholarships or publishing connections',
    rows: [
      ['clarion-workshop', 'Clarion Foundation', 'Clarion Science Fiction and Fantasy Writers’ Workshop', 'https://clarion.ucsd.edu/'],
      ['sewanee-writers-conference', 'Sewanee Writers’ Conference', 'Sewanee Writers’ Conference', 'https://www.sewaneewriters.org/'],
      ['bread-loaf-writers-conference', 'Middlebury College', 'Bread Loaf Writers’ Conference', 'https://www.middlebury.edu/writers-conferences/writers-conference'],
      ['lambda-literary-writers-retreat', 'Lambda Literary', 'Writers Retreat for Emerging LGBTQ Voices', 'https://lambdaliterary.org/writers-retreat/'],
      ['kenyon-review-writers-workshops', 'Kenyon Review', 'Writers Workshops', 'https://kenyonreview.org/event/summer-residential-writers-workshops/'],
      ['kundiman-retreat', 'Kundiman', 'Kundiman Retreat', 'https://www.kundiman.org/retreat'],
      ['storyknife-writers-residency', 'Storyknife', 'Storyknife Writers Residency', 'https://storyknife.org/residency/'],
      ['vermont-studio-center-writers', 'Vermont Studio Center', 'Writing Residencies and Fellowships', 'https://vermontstudiocenter.org/fellowships'],
      ['grubstreet-emerging-writer-fellowship', 'GrubStreet', 'Emerging Writer Fellowship', 'https://grubstreet.org/programs/emerging-writer-fellowship/'],
      ['authors-league-fund', 'Authors League Fund', 'Financial Assistance for Writers', 'https://authorsleaguefund.org/'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'creator-media', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Applicants must meet the current discipline, career stage, geography, project ownership, application window, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated creator and media opportunities.`);
