import { Work } from './work';

/** Error for the Work api */
export type APIWorkError = { error: 'Not found' };

/** Success response for the Work api */
export type APIWorkResponse = Work | APIWorkError;

/** List response for all the work done. */
export type APIWorkResponseList = {
  length: number;
  work: Work[];
};
