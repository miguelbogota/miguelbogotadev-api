import type { NextApiRequest, NextApiResponse } from 'next';
import experience from '@app-experience';

/**
 * Returns the experience passing the id. If no value is found retruns a not found error.
 */
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const experienceSearch = experience.find(_experience => _experience.id === id);

  if (!experienceSearch) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json(experienceSearch);
};

export default handler;
