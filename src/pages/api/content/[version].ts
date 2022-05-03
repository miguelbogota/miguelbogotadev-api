import type { NextApiRequest, NextApiResponse } from 'next';
import defaultCors from '@app-lib/default-cors';
import content from '@app-content';

/**
 * Returns the right content passing the version number (Which is the index in the content array).
 * If no value is found retruns a not found error.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Run cors
  await defaultCors(req, res);

  const { version } = req.query;

  const versionNumber = Number(version);
  const contentVersion = content[versionNumber - 1];

  if (!contentVersion) return res.status(404).json({ error: 'Not found' });

  return res.status(200).json(contentVersion);
};

export default handler;
