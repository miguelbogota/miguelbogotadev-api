import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import initMiddleware from '@app-lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  // Only allow requests with GET, POST and OPTIONS
  Cors({ methods: ['GET', 'HEAD', 'OPTIONS'] }),
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Run cors
  await cors(req, res);
  // Rest of the API logic
  res.json({ message: 'NEW MESSAGE' });
};

export default handler;
