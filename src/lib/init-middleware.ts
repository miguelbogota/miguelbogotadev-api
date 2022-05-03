import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

/**
 * Helper method to wait for a middleware to execute before continuing
 * and to throw an error when an error happens in a middleware.
 */
const initMiddleware = (middleware: ReturnType<typeof Cors>) => {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, result => (result instanceof Error ? reject(result) : resolve(result)));
    });
};

export default initMiddleware;
