import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

/** List with all the origins to allow make request from. */
const origins = [
  // Same project.
  'https://miguelbogotadev.vercel.app',
  // Main portfolio.
  'https://miguelbogotadev.com',
  // Other portfolio version.
  'https://miguelbogotadev.web.app',
];

/**
 * Helper method to wait for a middleware to execute before continuing
 * and to throw an error when an error happens in a middleware.
 */
const defaultCors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    // Only allow requests with GET, HEAD and OPTIONS
    Cors({ methods: ['GET', 'HEAD', 'OPTIONS'], origin: origins.join(',') })(req, res, result =>
      result instanceof Error ? reject(result) : resolve(result),
    );
  });

export default defaultCors;
