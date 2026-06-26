import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';

export class AuthService {
  static async register(data: any) {
    const { email, password, name } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashedPassword, name }
    });
  }

  static async login(data: any) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );
    
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken }
    });
    
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
      refreshToken
    };
  }

  static async refresh(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.hashedRefreshToken) {
      throw new Error('User no longer exists or session revoked');
    }

    const isValid = await bcrypt.compare(token, user.hashedRefreshToken);
    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );

    return newAccessToken;
  }

  static async logout(userId: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null }
    });
  }
}
