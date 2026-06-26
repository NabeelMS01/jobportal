import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page, limit, role } = req.query;
    
    const result = await UserService.findUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      role: role as string
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
