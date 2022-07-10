import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cron from 'node-cron';
import router from './routes';
import { AppDataSource } from './database';
import { WordEntity } from './database/entities/WordEntity';
import { UserEntity } from './database/entities/UserEntity';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(router);

cron.schedule('* */5 * * *', async () => {
  await WordEntity.update({ current: true }, { current: false });

  const word = await AppDataSource.getRepository(WordEntity)
    .createQueryBuilder('word')
    .where('length(word.word) = 5 and word.available = :isAvailable', {
      isAvailable: true,
    })
    .orderBy('random()')
    .getOne();

  if (word) {
    word.available = false;
    word.current = true;

    await AppDataSource.getRepository(WordEntity).save(word);
    return UserEntity.update({}, { attempts: 0 });
  }

  console.log('running a task every 5 minute');
});

export default app;
