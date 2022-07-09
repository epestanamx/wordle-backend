import 'reflect-metadata';
import 'dotenv/config';
import app from './app';
import { AppDataSource } from './db';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const port = process.env.SERVER_PORT || 3000;

    app.listen(port, () => {
      console.log('Server is listen on port', port);
    });
  } catch (e) {
    console.error(e);
  }
}

main();
