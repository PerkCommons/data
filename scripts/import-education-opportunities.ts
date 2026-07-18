import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = [id: string, provider: string, title: string, url: string];
const groups: Array<{ subcategories: string[]; tags: string[]; description: string; value: string; rows: Row[] }> = [
  {
    subcategories: ['courses', 'learning-paths'], tags: ['online-learning', 'self-paced'],
    description: 'an open online learning catalog with structured courses or learning paths',
    value: 'Self-paced lessons, exercises, and subject-specific learning paths',
    rows: [
      ['mit-opencourseware', 'Massachusetts Institute of Technology', 'MIT OpenCourseWare', 'https://ocw.mit.edu/'],
      ['openlearn-free-courses', 'The Open University', 'OpenLearn Free Courses', 'https://www.open.edu/openlearn/free-courses/full-catalogue'],
      ['freecodecamp-curriculum', 'freeCodeCamp', 'freeCodeCamp Curriculum', 'https://www.freecodecamp.org/learn/'],
      ['khan-academy-courses', 'Khan Academy', 'Khan Academy Courses', 'https://www.khanacademy.org/'],
      ['harvard-cs50-open-courses', 'Harvard University', 'CS50 Open Courses', 'https://www.harvardonline.harvard.edu/course/cs50-introduction-computer-science'],
      ['microsoft-learn-training', 'Microsoft', 'Microsoft Learn Training', 'https://learn.microsoft.com/en-us/training/'],
      ['google-skillshop', 'Google', 'Google Skillshop', 'https://skillshop.withgoogle.com/'],
      ['ibm-skillsbuild-courses', 'IBM', 'IBM SkillsBuild', 'https://skillsbuild.org/'],
      ['cisco-skills-for-all', 'Cisco', 'Skills for All', 'https://skillsforall.com/'],
      ['saylor-academy-courses', 'Saylor Academy', 'Free Online Courses', 'https://learn.saylor.org/'],
    ],
  },
  {
    subcategories: ['bootcamps', 'scholarships', 'tuition-support'], tags: ['bootcamp', 'tuition-free'],
    description: 'a tuition-free or fully supported intensive training program',
    value: 'Structured instruction, projects, community support, and no-cost or scholarship-backed tuition',
    rows: [
      ['ada-developers-academy', 'Ada Developers Academy', 'Software Development Training Program', 'https://adadevelopersacademy.org/'],
      ['codepath-courses', 'CodePath', 'No-Cost Tech Courses', 'https://www.codepath.org/courses'],
      ['recurse-center', 'Recurse Center', 'Recurse Center Retreat', 'https://www.recurse.com/'],
      ['school-of-code-bootcamp', 'School of Code', 'Free Coding Bootcamp', 'https://schoolofcode.co.uk/'],
      ['founders-and-coders', 'Founders and Coders', 'Tuition-Free Coding Bootcamp', 'https://www.foundersandcoders.com/'],
      ['42-network', '42', 'Tuition-Free Software Engineering Education', 'https://www.42network.org/'],
      ['codeyourfuture-training', 'CodeYourFuture', 'Free Tech Training', 'https://codeyourfuture.io/'],
      ['hackyourfuture-program', 'HackYourFuture', 'Web Development Program', 'https://www.hackyourfuture.net/'],
      ['resilient-coders-bootcamp', 'Resilient Coders', 'Software Engineering Bootcamp', 'https://www.resilientcoders.org/'],
      ['generation-tech-programs', 'Generation Australia', 'Free Technology Career Programs', 'https://australia.generation.org/find-a-program/'],
    ],
  },
  {
    subcategories: ['workshops', 'courses'], tags: ['workshops', 'practical-learning'],
    description: 'a practical workshop program with guided, hands-on learning materials or sessions',
    value: 'Hands-on instruction, reusable workshop materials, and guided practice',
    rows: [
      ['software-carpentry-workshops', 'The Carpentries', 'Software Carpentry Workshops', 'https://software-carpentry.org/workshops/'],
      ['data-carpentry-workshops', 'The Carpentries', 'Data Carpentry Workshops', 'https://datacarpentry.org/workshops/'],
      ['library-carpentry-workshops', 'The Carpentries', 'Library Carpentry Workshops', 'https://librarycarpentry.org/'],
      ['google-codelabs', 'Google for Developers', 'Google Codelabs', 'https://codelabs.developers.google.com/'],
      ['microsoft-reactor-events', 'Microsoft Reactor', 'Live Training Events', 'https://developer.microsoft.com/en-us/reactor/'],
      ['aws-workshops', 'Amazon Web Services', 'AWS Workshops', 'https://workshops.aws/'],
      ['github-skills', 'GitHub', 'GitHub Skills', 'https://skills.github.com/'],
      ['nvidia-dli-self-paced', 'NVIDIA', 'Deep Learning Institute Courses', 'https://www.nvidia.com/en-us/training/online/'],
      ['tensorflow-workshops', 'TensorFlow', 'TensorFlow Learning Resources', 'https://www.tensorflow.org/resources/learn-ml'],
      ['mozilla-web-development', 'Mozilla', 'Learn Web Development', 'https://developer.mozilla.org/en-US/docs/Learn_web_development'],
    ],
  },
  {
    subcategories: ['certifications', 'learning-paths'], tags: ['credentials', 'professional-learning'],
    description: 'a training and credential pathway with an official assessment or verifiable certificate',
    value: 'Role-based learning and an official certificate, badge, or certification pathway',
    rows: [
      ['freecodecamp-certifications', 'freeCodeCamp', 'Developer Certifications', 'https://www.freecodecamp.org/learn/'],
      ['ibm-skillsbuild-credentials', 'IBM', 'SkillsBuild Digital Credentials', 'https://skillsbuild.org/students/digital-credentials'],
      ['cisco-networking-academy', 'Cisco', 'Networking Academy', 'https://www.netacad.com/'],
      ['hubspot-academy-certifications', 'HubSpot Academy', 'Free Certification Courses', 'https://academy.hubspot.com/certification-overview'],
      ['google-analytics-certification', 'Google', 'Google Analytics Certification', 'https://skillshop.docebosaas.com/learn/public/learning_plan/view/analytics-certification'],
      ['semrush-academy-certificates', 'Semrush Academy', 'Free Marketing Certifications', 'https://www.semrush.com/academy/'],
      ['mongodb-university-certification', 'MongoDB', 'MongoDB University and Certification', 'https://learn.mongodb.com/'],
      ['linux-foundation-free-courses', 'Linux Foundation', 'Free Training Courses', 'https://training.linuxfoundation.org/resources/?_sft_content_type=free-course'],
      ['salesforce-trailhead-badges', 'Salesforce', 'Trailhead Credentials', 'https://trailhead.salesforce.com/content/learn/modules/salesforce-credentials-quick-look/get-familiar-with-salesforce-credentials-on-trailhead'],
      ['fortinet-training-institute', 'Fortinet', 'Training Institute', 'https://www.fortinet.com/training'],
    ],
  },
  {
    subcategories: ['exam-vouchers', 'scholarships', 'tuition-support'], tags: ['certification', 'financial-support'],
    description: 'a scholarship, discount, or funded pathway that reduces the cost of professional training and assessment',
    value: 'Eligible learners receive training support and a free or discounted certification assessment',
    rows: [
      ['isc2-one-million-cc', 'ISC2', 'One Million Certified in Cybersecurity', 'https://www.isc2.org/landing/1mcc'],
      ['linux-foundation-lift-scholarships', 'Linux Foundation', 'LiFT Scholarship Program', 'https://www.linuxfoundation.org/about/lift-scholarships'],
      ['aws-restart', 'Amazon Web Services', 'AWS re/Start', 'https://aws.amazon.com/training/restart/'],
      ['cisco-netacad-exam-discounts', 'Cisco Networking Academy', 'Certification Exam Discounts', 'https://www.netacad.com/career-resources/certifications'],
      ['red-hat-academy', 'Red Hat', 'Red Hat Academy', 'https://www.redhat.com/en/services/training/red-hat-academy'],
      ['google-career-certificate-scholarships', 'Google', 'Career Certificate Scholarships', 'https://grow.google/certificates/'],
      ['aws-emerging-talent-community', 'Amazon Web Services', 'AWS Academy Training Benefits', 'https://aws.amazon.com/training/awsacademy/'],
      ['comptia-academic-store', 'CompTIA', 'Academic Store Certification Discounts', 'https://academic-store.comptia.org/'],
      ['splunk-academic-alliance', 'Splunk', 'Splunk Academic Alliance', 'https://www.splunk.com/en_us/resources/splunk-academic-alliance-program.html'],
      ['uipath-academic-alliance', 'UiPath', 'Academic Alliance', 'https://www.uipath.com/hubfs/resources/documents/PDFs/UiPath_Academic_Program_Guide.pdf'],
    ],
  },
];

const outputDirectory = resolve(process.cwd(), 'opportunities');
await mkdir(outputDirectory, { recursive: true });
let count = 0;
for (const group of groups) for (const [id, provider, title, url] of group.rows) {
  const record = {
    id, provider, title, category: 'education-training', subcategories: group.subcategories, tags: group.tags,
    description: `${title} is ${group.description} administered by ${provider}.`,
    eligibility: 'Learners must meet the current age, location, affiliation, experience, and program-specific requirements.',
    value: group.value, sourceUrl: url, officialUrl: url, status: 'limited', submissionType: 'maintainer', sponsor: false,
    reviewDate: '2026-07-18', regions: ['Global'],
  };
  await writeFile(resolve(outputDirectory, `${id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  count += 1;
}
console.log(`Wrote ${count} curated education and training opportunities.`);
