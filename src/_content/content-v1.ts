import { ContentV1 } from 'public/types';

export const contentV1: ContentV1 = {
  about:
    "Fascinated by frontend and backend development. As an React developer I love to build stunning UI designs with highly efficient backend structures in TypeScript.\nI'm a software developer who is passionate about making open-source projects, creating technology people can enjoy and cats 🐱. Some technologies I enjoy working with include Next js, Angular, Flutter, React Native, C# and Rust.",
  email: 'miguelbogotadev@outlook.com',
  headline: 'Software Developer',
  imageUrls: [
    {
      label: 'Profile page banner.',
      url: 'https://firebasestorage.googleapis.com/v0/b/miguelbogotadev.appspot.com/o/cover-images%2Fprofile.png?alt=media&token=8851a755-0c42-4c4b-acec-c61e5588d931',
    },
    {
      label: 'Contact page banner.',
      url: 'https://firebasestorage.googleapis.com/v0/b/miguelbogotadev.appspot.com/o/cover-images%2Fcontact.png?alt=media&token=d2c1a5ca-ed22-492d-bb84-752fce168e39',
    },
    {
      label: 'Works page banner.',
      url: 'https://firebasestorage.googleapis.com/v0/b/miguelbogotadev.appspot.com/o/cover-images%2Fworks.png?alt=media&token=e0e9d85b-ed66-4ebe-a733-7328b3c09c0f',
    },
  ],
  isOpenForJobs: true,
  name: 'Miguel Bogota Dev',
  pageDescriptions: {
    contact:
      "Let me help you with your project.\nIt could be just the thing your brand needs. Send me an email and I'll happily be with you in the shortest time possible.",
    works:
      "I care deeply about the code I write and the effect my work has on the product I'm building. You will see below some of the work I'm most proud of.",
  },
  skills: [
    {
      category: 'Front End',
      skillNames: [
        'HTML / XHTML',
        'CSS / Sass / LESS',
        'JS ES6 / TS',
        '508 Accessibility',
        'React JS',
        'Redux / Recoil.js',
        'Next js',
        'Flutter',
        'Angular 2+',
        'Angular Material',
        'Bootstrap',
        'Materializecss',
        'Material UI',
        'Blazor / .NET Core',
        'Rollup / Snowpack',
        'Gulp / Webpack',
      ],
    },
    {
      category: 'Back End',
      skillNames: [
        'Node.js / Nest js',
        'PostgreSQL / MySQL',
        'SQL Server / MariaDB',
        'REST / GraphQL',
        'Firebase / AWS / GCP',
        'C# / .NET CoreAPI',
        'Dart / Conduit',
        'Nexus Schema',
        'Vercel',
      ],
    },
    {
      category: 'Source Control',
      skillNames: [
        'Git (Git Flow)',
        'SCRUM / Agile',
        'GitHub / GitLab',
        'Jira / PivotalTracker',
        'Docker',
        'Linux',
      ],
    },
    {
      category: 'UI/UX',
      skillNames: [
        'Wireframing / UML',
        'Prototyping',
        'Adobe Suit',
        'User Stories',
        'Atomic Design',
        'Accessibility',
        'Material Design',
        'Fluent Design',
        'Figma',
      ],
    },
  ],
  tags: ['Web + Technology + UI/UX', 'Bogotá, Colombia', 'Modern + Professional + Coder'],
};
