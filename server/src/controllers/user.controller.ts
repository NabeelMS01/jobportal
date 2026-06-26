import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    
    const where: any = {};
    if (role) where.role = role as string;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
