import { Work } from './work';

/** Error for the Work api */
export type APIWorkError = { error: string };

/** Success response for the Work api */
export type APIWorkResponse = APIWorkError | Work;

/** List response for all the work done. */
export type APIWorkResponseList =
  | APIWorkError
  | {
      length: number;
      work: Work[];
    };
