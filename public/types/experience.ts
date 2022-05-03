/**
 * The experience type will not be normalized so you have to make sure it has capital case where it
 * need to be.
 */
export type Experience = {
  /**
   * Id will be the name in lowercase and with dashes and it will be use as the url to access a
   * single experience.
   */
  id: string;
  /** Name of the experience (Will be display at the to of the page). */
  name: string;
  /** Boolean checking if you currently work in this experience. */
  isActive: boolean;
  /** Description with detailed summary of the experience. */
  description: string;
  /** Role you had in the experience. */
  role: string;
  /** List with all the technologies used while working in the experience. */
  technologies: string[];
  /**
   * List with all the image urls to show the project (The first in the array will be the main
   * image).
   */
  imageUrls: string[];
  /** Optional url to the repository. */
  gitUrl?: string;
  /** Optional url to the web. */
  webUrl?: string;
  /** Date in which the project was started (Format: yyyy-MM-dd). */
  startedAt: `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
};
