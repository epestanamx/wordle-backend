import { DataSource } from 'typeorm';
import { GameEntity } from './entities/GameEntity';
import { UserEntity } from './entities/UserEntity';
import { WordEntity } from './entities/WordEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'wordle',
  entities: [UserEntity, WordEntity, GameEntity],
  logging: false,
  synchronize: true,
});
