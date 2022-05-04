import type { NextApiRequest, NextApiResponse } from 'next';
import type { APIWorkResponse } from 'public/types';
import defaultCors from '@app-lib/default-cors';
import work from '@app-work';

/**
 * Returns the experience passing the id. If no value is found retruns a not found error.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<APIWorkResponse>) => {
  const hasError = await defaultCors(req, res).catch(err => err.message);
  if (!!hasError) return res.status(500).json({ error: hasError as string });

  const { id } = req.query;

  const experienceSearch = work.find(_work => _work.id === id);

  if (!experienceSearch) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json(experienceSearch);
};

export default handler;
