import type { NextApiRequest, NextApiResponse } from 'next';
import experience from '@app-experience';

/**
 * Returns an array with all the experiences and additional data.
 */
const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ length: experience.length, experience });
};

export default handler;
