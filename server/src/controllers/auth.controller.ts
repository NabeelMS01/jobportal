import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    await AuthService.register(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      // Prevent user enumeration by returning a generic error
      return res.status(400).json({ message: 'Invalid credentials or user already exists' });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user, token, refreshToken } = await AuthService.login(req.body);
    
    res.cookie('accessToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    
    res.status(200).json({ user, token });
  } catch (error: any) {
    if (error.message === 'User not found' || error.message === 'Invalid credentials') {
      // Generic error message for both conditions
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const logout = async (req: any, res: Response): Promise<any> => {
  if (req.user) {
    await AuthService.logout(req.user.id);
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const me = (req: any, res: Response): any => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
      const newAccessToken = await AuthService.refresh(refreshTokenCookie);
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      res.status(200).json({ token: newAccessToken });
    } catch (serviceError: any) {
      if (serviceError.message === 'User no longer exists') {
        return res.status(401).json({ message: serviceError.message });
      }
      throw serviceError;
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
