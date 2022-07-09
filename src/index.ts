import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).send({
    name: 'wordle-backend',
    version: '1.0.0',
    description: 'Wordle Backend',
  });
});

app.listen(3000, () => {
  console.log('Server is listen on port', 3000);
});
