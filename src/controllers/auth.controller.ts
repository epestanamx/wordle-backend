import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserEntity } from '../database/entities/UserEntity';
import { GameEntity } from '../database/entities/GameEntity';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserEntity.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET || 'secret', {
      expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({ ...userWithoutPassword, token });
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserEntity.findOne({ where: { email } });

    if (user) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new UserEntity();
    user.name = name;
    user.email = email;
    user.password = hash;

    user = await user.save();

    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign({}, process.env.SECRET || 'secret', {
      expiresIn: '7d',
    });

    return res.status(201).send({
      ...userWithoutPassword,
      token,
    });
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const profile = async (req: any, res: Response) => {
  try {
    const user = await UserEntity.findOne({ where: { id: req.userId }, relations: ['games'] });
    const gamesWon = user?.games.filter((game: GameEntity) => game.won).length;

    const statistics = {
      played: user?.games.length,
      won: gamesWon,
      lost: (user?.games || []).length - (gamesWon || 0),
    };

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { password: _, games: __, ...userWithoutPassword } = user;

    return res.status(200).send({ ...userWithoutPassword, statistics });
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
