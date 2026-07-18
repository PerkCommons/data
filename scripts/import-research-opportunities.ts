import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];

const groups: Array<{
  subcategories: string[];
  tags: string[];
  description: string;
  value: string;
  rows: Row[];
}> = [
  {
    subcategories: ['research-internships', 'research-assistantships', 'lab-programs'],
    tags: ['research', 'internships'],
    description: 'a supervised research internship with project work in an academic or scientific environment',
    value: 'Research experience, supervision, and program-specific funding or support',
    rows: [
      ['oist-research-internship', 'Okinawa Institute of Science and Technology', 'Research Internship Program', 'https://admissions.oist.jp/oist-research-internship-program-description'],
      ['ista-scientific-internships', 'Institute of Science and Technology Austria', 'Scientific Internships', 'https://phd.pages.ist.ac.at/scientific-internships/'],
      ['daad-rise-germany', 'German Academic Exchange Service', 'RISE Germany', 'https://www.daad.de/rise/en/rise-germany/'],
      ['mit-msrp', 'Massachusetts Institute of Technology', 'MIT Summer Research Program', 'https://oge.mit.edu/msrp/'],
      ['amgen-scholars', 'Amgen Foundation', 'Amgen Scholars Program', 'https://amgenscholars.com/'],
      ['rockefeller-surf', 'Rockefeller University', 'Summer Undergraduate Research Fellowship', 'https://www.rockefeller.edu/education-and-training/surf/'],
      ['cshl-undergraduate-research', 'Cold Spring Harbor Laboratory', 'Undergraduate Research Program', 'https://www.cshl.edu/education/undergraduate-research-program/'],
      ['st-jude-poe', 'St. Jude Children\'s Research Hospital', 'Pediatric Oncology Education Program', 'https://www.stjude.org/education-training/research-training/undergraduate/poe.html'],
      ['caltech-wave-fellows', 'California Institute of Technology', 'WAVE Fellows Program', 'https://sfp.caltech.edu/undergraduate-research/programs/wavefellows'],
      ['embl-undergraduate-internships', 'European Molecular Biology Laboratory', 'Undergraduate Internships', 'https://www.embl.org/about/info/undergraduates/'],
    ],
  },
  {
    subcategories: ['visiting-researcher-programs', 'lab-programs'],
    tags: ['research', 'visiting-researchers'],
    description: 'a visiting-researcher or visiting-scholar program offering access to a research community or facility',
    value: 'Research affiliation, collaboration, facilities, and program-specific financial support',
    rows: [
      ['fulbright-visiting-scholar', 'Fulbright Scholar Program', 'Visiting Scholar Program', 'https://fulbrightscholars.org/non-us-scholars/fulbright-visiting-scholar-program'],
      ['nih-visiting-program', 'National Institutes of Health', 'NIH Visiting Program', 'https://ors.od.nih.gov/pes/dis/VisitingScientists/Pages/default.aspx'],
      ['janelia-visiting-scientist', 'HHMI Janelia Research Campus', 'Visiting Scientist Program', 'https://www.janelia.org/you-janelia/visiting-scientists'],
      ['sfi-visitor-program', 'Santa Fe Institute', 'Visitor Program', 'https://www.santafe.edu/engage/visit'],
      ['ias-memberships', 'Institute for Advanced Study', 'Memberships and Visiting Positions', 'https://www.ias.edu/apply'],
      ['kitp-program-participants', 'Kavli Institute for Theoretical Physics', 'Research Program Participants', 'https://www.kitp.ucsb.edu/participate'],
      ['perimeter-visiting-researchers', 'Perimeter Institute', 'Visiting Researchers Program', 'https://perimeterinstitute.ca/research/visitor-programs/scientific-visitors'],
      ['nasa-guest-investigator-programs', 'NASA Science', 'Guest Investigator Programs', 'https://science.nasa.gov/researchers/sara/grant-solicitations/'],
      ['esa-visiting-scientist', 'European Space Agency', 'Research Fellowship Programme', 'https://www.esa.int/About_Us/Careers_at_ESA/Post_docs_Research_Fellowship'],
      ['embl-visitor-programme', 'European Molecular Biology Laboratory', 'Scientific Visitor Programme', 'https://www.embl.org/about/info/scientific-visitor-programme/'],
    ],
  },
  {
    subcategories: ['dataset-access'],
    tags: ['research-data', 'datasets'],
    description: 'an official research-data access program or repository with datasets available under its stated access conditions',
    value: 'Access to curated datasets, documentation, and research-use infrastructure',
    rows: [
      ['cern-open-data-portal', 'CERN', 'CERN Open Data Portal', 'https://opendata.cern.ch/'],
      ['nasa-earthdata', 'NASA', 'Earthdata', 'https://www.earthdata.nasa.gov/'],
      ['nih-dbgap', 'National Institutes of Health', 'Database of Genotypes and Phenotypes', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/about.html'],
      ['uk-biobank-research-access', 'UK Biobank', 'Researcher Access', 'https://www.ukbiobank.ac.uk/enable-your-research/apply-for-access'],
      ['icpsr-data-access', 'ICPSR', 'Research Data Access', 'https://www.icpsr.umich.edu/web/pages/'],
      ['nci-genomic-data-commons', 'National Cancer Institute', 'Genomic Data Commons', 'https://gdc.cancer.gov/access-data'],
      ['physionet-data-access', 'MIT Laboratory for Computational Physiology', 'PhysioNet Data Access', 'https://physionet.org/about/database/'],
      ['copernicus-data-space', 'European Union', 'Copernicus Data Space Ecosystem', 'https://dataspace.copernicus.eu/'],
      ['esa-earth-observation-data', 'European Space Agency', 'Earth Observation Data Access', 'https://earth.esa.int/eogateway/catalog'],
      ['world-bank-data', 'World Bank', 'World Bank Open Data', 'https://data.worldbank.org/'],
    ],
  },
  {
    subcategories: ['compute-credits'],
    tags: ['research-compute', 'cloud-credits'],
    description: 'a compute-access or cloud-credit program intended to support eligible research workloads',
    value: 'Cloud, accelerator, or high-performance-computing resources under program-specific limits',
    rows: [
      ['google-cloud-research-credits', 'Google Cloud', 'Research Credits', 'https://edu.google.com/programs/credits/research/'],
      ['aws-cloud-credit-for-research', 'Amazon Web Services', 'Cloud Credit for Research', 'https://aws.amazon.com/government-education/research-and-technical-computing/cloud-credit-for-research/'],
      ['microsoft-azure-research-credits', 'Microsoft Research', 'Azure Research Credits', 'https://www.microsoft.com/en-us/research/academic-program/microsoft-azure-for-research/'],
      ['nsf-access-allocations', 'National Science Foundation', 'ACCESS Allocations', 'https://allocations.access-ci.org/'],
      ['nairr-pilot-allocations', 'National Science Foundation', 'NAIRR Pilot Resource Access', 'https://nairrpilot.org/allocations'],
      ['google-tpu-research-cloud', 'Google', 'TPU Research Cloud', 'https://sites.research.google/trc/about/'],
      ['nvidia-academic-grant-program', 'NVIDIA', 'Academic Grant Program', 'https://www.nvidia.com/en-us/industries/higher-education-research/academic-grant-program/'],
      ['oracle-research-cloud-credits', 'Oracle for Research', 'Oracle for Research Project Award', 'https://go.oracle.com/research-project-award'],
      ['ibm-academic-initiative-cloud', 'IBM', 'IBM Academic Initiative', 'https://www.ibm.com/academic'],
      ['jetstream2-allocations', 'Jetstream2', 'Jetstream2 Allocations', 'https://jetstream-cloud.org/get-started/index.html'],
    ],
  },
  {
    subcategories: ['academic-challenges'],
    tags: ['research', 'challenges'],
    description: 'an official challenge platform or recurring program where researchers can test methods against defined problems',
    value: 'Benchmark data, evaluation, collaboration, and challenge-specific recognition or awards',
    rows: [
      ['dream-challenges', 'Sage Bionetworks', 'DREAM Challenges', 'https://dreamchallenges.org/'],
      ['grand-challenge-medical-imaging', 'Grand Challenge', 'Biomedical Image Analysis Challenges', 'https://grand-challenge.org/'],
      ['nist-challenges', 'National Institute of Standards and Technology', 'Open Innovation Prize Challenges', 'https://www.nist.gov/ctl/pscr/open-innovation-prize-challenges'],
      ['nist-trec', 'National Institute of Standards and Technology', 'Text REtrieval Conference', 'https://trec.nist.gov/'],
      ['nasa-solve', 'NASA', 'NASA Solve Challenges', 'https://www.nasa.gov/solve/'],
      ['drivendata-research-competitions', 'DrivenData', 'Data Science Competitions', 'https://www.drivendata.org/competitions/'],
      ['codalab-competitions', 'CodaLab', 'CodaLab Competitions', 'https://codalab.lisn.upsaclay.fr/competitions/'],
      ['evalai-challenges', 'CloudCV', 'EvalAI Challenges', 'https://eval.ai/web/challenges/list'],
      ['isic-challenges', 'International Skin Imaging Collaboration', 'ISIC Challenges', 'https://challenge.isic-archive.com/'],
      ['bioasq-challenges', 'BioASQ', 'BioASQ Challenges', 'https://www.bioasq.org/'],
    ],
  },
  {
    subcategories: ['publication-support'],
    tags: ['publishing', 'open-access'],
    description: 'a publication-support, fee-waiver, or research-communication program for eligible authors',
    value: 'Publishing guidance, access support, fee assistance, or research dissemination infrastructure',
    rows: [
      ['research4life-publishing-support', 'Research4Life', 'Author and Publishing Resources', 'https://www.research4life.org/training/authorship-skills/'],
      ['eifl-open-access-agreements', 'EIFL', 'Open Access Agreements', 'https://eifl.net/news/eifl-oa-agreements-continue-attract-authors'],
      ['plos-publication-fee-assistance', 'PLOS', 'Publication Fee Assistance', 'https://plos.org/publish/fees/'],
      ['frontiers-fee-support', 'Frontiers', 'Article Processing Charge Support', 'https://www.frontiersin.org/about/fee-policy'],
      ['springer-nature-waivers', 'Springer Nature', 'Open Access Waivers and Discounts', 'https://support.springernature.com/en/support/solutions/articles/6000211135'],
      ['wiley-open-access-waivers', 'Wiley', 'Open Access Waivers and Discounts', 'https://authorservices.wiley.com/author-resources/Journal-Authors/open-access/article-publication-charges/waivers-and-discounts.html'],
      ['taylor-francis-open-access-support', 'Taylor & Francis', 'Open Access Discounts and Waivers', 'https://authorservices.taylorandfrancis.com/choose-open/publishing-open-access/requesting-an-apc-waiver/'],
      ['ieee-open-access-discounts', 'IEEE', 'Open Access Discounts', 'https://open.ieee.org/for-authors/article-processing-charges/'],
      ['royal-society-fee-waivers', 'Royal Society', 'Open Access Equity', 'https://royalsociety.org/journals/open-access/open-access-equity/'],
      ['arxiv-submission-access', 'arXiv', 'arXiv Submission Access', 'https://info.arxiv.org/help/submit/index.html'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) {
  for (const [id, provider, title, url] of group.rows) {
    const record = {
      id,
      provider,
      title,
      category: 'research-opportunities',
      subcategories: group.subcategories,
      tags: group.tags,
      description: `${title} is ${group.description} administered by ${provider}.`,
      eligibility: 'Researchers must meet the current program, affiliation, location, subject-area, and application requirements.',
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

console.log(`Wrote ${count} curated research opportunities.`);
