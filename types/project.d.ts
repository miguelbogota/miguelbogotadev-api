/**
 * Represents a portfolio project with comprehensive details about
 * its scope, implementation, and resources.
 */
type Project = {
  /** Unique identifier for the project. */
  id: string;
  /** Project start date in format yyyy-mm-dd. */
  startedAt: `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
  /** Indicates if the project is currently active. */
  isCurrent: boolean;
  /** Indicates if the project is archived. */
  isArchived: boolean;
  /** Indicates if the project is an aggregate of multiple related projects. */
  aggregate?: boolean;
  /** Project title. */
  displayName: string;
  /** Brief overview of what the project does. */
  summary: string;
  /** User's role or position in the project. */
  role: string;
  /** Organization or company associated with the project. */
  companyName: string;
  /** Industry, domain, or category (e.g., "Finance", "E-commerce"). */
  industry: string;
  /** Technology stack and relevant keywords. */
  tags: string[];
  /** Describes the problem being solved. */
  challenge: {
    /** Challenge headline that reads naturally as a sentence. */
    title: string;
    /** Detailed explanation of the problem. */
    description: string;
  };
  /** Describes how the challenge was addressed. */
  solution: {
    /** Solution headline that reads naturally as a sentence. */
    title: string;
    /** Detailed explanation of the approach. */
    description: string;
  };
  /** Project showcase images. */
  images: {
    /** Image file path or URL. */
    src: string;
    /** Accessible text describing the image. */
    alt: string;
  }[];
  /** External resources related to the project. */
  links?: {
    /** Display text and accessible name for the link. */
    label: string;
    /** Boxicons class names for the external resource. */
    icon: string;
    /** URL to the external resource. */
    url: string;
  }[];
};
