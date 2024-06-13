import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/app/lib/data';
import { User } from '@/app/lib/definitions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const user: User = req.body;

    try {
      const message = await createUser(user);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
