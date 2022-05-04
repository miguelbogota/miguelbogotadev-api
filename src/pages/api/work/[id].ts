import type { NextApiRequest, NextApiResponse } from 'next';
import type { APIWorkResponse } from 'public/types/api-response';
import defaultCors from '@app-lib/default-cors';
import work from '@app-work';

/**
 * Returns the experience passing the id. If no value is found retruns a not found error.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<APIWorkResponse>) => {
  // Run cors
  await defaultCors(req, res);

  const { id } = req.query;

  const experienceSearch = work.find(_work => _work.id === id);

  if (!experienceSearch) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json(experienceSearch);
};

export default handler;
