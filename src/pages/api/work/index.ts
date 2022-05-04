import type { NextApiRequest, NextApiResponse } from 'next';
import type { APIWorkResponseList } from 'public/types';
import defaultCors from '@app-lib/default-cors';
import work from '@app-work';

/**
 * Returns an array with all the experiences and additional data.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<APIWorkResponseList>) => {
  const hasError = await defaultCors(req, res).catch(err => err.message);
  if (!!hasError) return res.status(500).json({ error: hasError as string });

  return res.status(200).json({ length: work.length, work });
};

export default handler;
