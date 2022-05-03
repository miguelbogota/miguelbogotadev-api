import type { NextApiRequest, NextApiResponse } from 'next';
import defaultCors from '@app-lib/default-cors';
import experience from '@app-experience';

/**
 * Returns an array with all the experiences and additional data.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Run cors
  await defaultCors(req, res);

  return res.status(200).json({ length: experience.length, experience });
};

export default handler;
