import { DataSource } from 'typeorm';
import { GameEntity } from './entities/GameEntity';
import { UserEntity } from './entities/UserEntity';
import { WordEntity } from './entities/WordEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  entities: [UserEntity, WordEntity, GameEntity],
  logging: true,
  synchronize: true,
});
