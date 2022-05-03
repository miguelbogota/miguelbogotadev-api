import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

/**
 * Helper method to wait for a middleware to execute before continuing
 * and to throw an error when an error happens in a middleware.
 */
const defaultCors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    // Only allow requests with GET, POST and OPTIONS
    Cors({ methods: ['GET', 'HEAD', 'OPTIONS'], origin: '*' })(req, res, result =>
      result instanceof Error ? reject(result) : resolve(result),
    );
  });

export default defaultCors;
