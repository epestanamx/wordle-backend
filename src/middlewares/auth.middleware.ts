import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { UserEntity } from '../database/entities/UserEntity';

export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];

    const session: any = await jwt.verify(token, process.env.SECRET || 'secret');

    const user = await UserEntity.findOne({ where: { id: session.id } });

    if (!user) {
      throw new Error('User not found');
    }

    req.userId = user.id;

    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
