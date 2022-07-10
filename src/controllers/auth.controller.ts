import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserEntity } from '../entities/UserEntity';

export const login = async (req: Request, res: Response) => {
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
};

export const register = async (req: Request, res: Response) => {
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
};
