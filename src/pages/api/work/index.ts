import type { NextApiRequest, NextApiResponse } from 'next';
import type { APIWorkResponseList } from 'public/types/api-response';
import defaultCors from '@app-lib/default-cors';
import work from '@app-work';

/**
 * Returns an array with all the experiences and additional data.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<APIWorkResponseList>) => {
  // Run cors
  await defaultCors(req, res);

  return res.status(200).json({ length: work.length, work });
};

export default handler;
