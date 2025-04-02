import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

declare global {
  namespace Express {
    interface Request {
      user: {
        uid: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Auth middleware - No token or invalid format');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Auth middleware - Token received:', token.substring(0, 20) + '...');
    
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Auth middleware - Token verified for user:', decodedToken.uid);
    
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}; 