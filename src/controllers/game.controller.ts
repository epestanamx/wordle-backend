import { Response } from 'express';
import { GameEntity } from '../database/entities/GameEntity';
import { UserEntity } from '../database/entities/UserEntity';
import { WordEntity } from '../database/entities/WordEntity';

const removeAccents = (word = '') => {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const playGame = async (req: any, res: Response) => {
  let { userWord } = req.body;
  userWord = removeAccents(userWord);

  if (userWord.length !== 5) {
    return res.status(400).send({
      error: 'The word must be 5 characters long',
    });
  }

  const user = await UserEntity.findOne({
    where: {
      id: req.userId,
    },
  });

  if (user?.attempts && user?.attempts >= 5) {
    return res.status(400).send({
      error: 'You have reached the maximum number of attempts',
    });
  }

  let word: any = await WordEntity.findOne({ where: { current: true } });
  const wordId = word?.id || 0;
  word = removeAccents(word?.word);

  const response: any[] = [];
  let attempts = 0;
  let winner = false;

  if (word === userWord) {
    response.push(...userWord.split('').map((letter: string) => ({ letter, value: 1 })));
    winner = true;
  } else {
    for (let i = 0; i < userWord.length; i++) {
      if (!word.includes(userWord[i])) {
        response.push({
          letter: userWord[i],
          value: 3,
        });
      } else if (word[i] === userWord[i]) {
        response.push({
          letter: userWord[i],
          value: 1,
        });
      } else {
        response.push({
          letter: userWord[i],
          value: 2,
        });
      }

      attempts = attempts + 1;
    }
  }

  await UserEntity.update({ id: req.userId }, { attempts });

  const game = new GameEntity();
  game.user = req.userId;
  game.word = wordId;
  game.won = winner;

  await game.save();

  return res.status(200).send(response);
};
