import { MongoClient } from 'mongodb';
import user from './examples/user/data/seed';
import userForRelay from './examples/userForRelay/data/seed';
import northwind from './examples/northwind/data/seed';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-compose-mongoose';

let db;
async function run() {
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });

  console.log('Starting seed `user`...');
  await user(db);

  console.log('Starting seed `userForRelay`...');
  await userForRelay(db);

  console.log('Starting seed `northwind`...');
  await northwind(db);

  console.log('Seed competed!');
  db.close();
};

run().catch(e => {
  console.log(e);
  process.exit(0);
});
