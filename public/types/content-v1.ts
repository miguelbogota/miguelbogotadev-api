/**
 * Content that will be shown in the main page for the portfolio v1.
 */
export type ContentV1 = {
  name: string;
  headline: string;
  about: string;
  pageDescriptions: {
    works: string;
    contact: string;
  };
  imageUrls: {
    url: string;
    label: string;
  }[];
  skills: {
    category: string;
    skillNames: string[];
  }[];
  email: string;
  tags: string[];
  isOpenForJobs: boolean;
};
