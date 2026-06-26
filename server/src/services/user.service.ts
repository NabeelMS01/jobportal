import prisma from '../utils/db';

export class UserService {
  static async findUsers(query: { page?: number | undefined; limit?: number | undefined; role?: string | undefined }) {
    const { page = 1, limit = 10, role } = query;
    
    const where: any = {};
    if (role) where.role = role;

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

    return {
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  }
}
