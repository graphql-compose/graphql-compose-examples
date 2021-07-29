import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

mongoose.Promise = Promise;

const opts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, opts);

export const { connection } = mongoose;
connection.on('error', (e) => {
  if (e.message.code === 'ETIMEDOUT') {
    console.log(e);
    mongoose.connect(MONGODB_URI, opts);
  }
  console.log(e);
});
connection.on('connected', () => {
  console.log(`MongoDB successfully connected to ${MONGODB_URI}`);
});
connection.on('reconnected', () => {
  console.log('MongoDB reconnected!');
});

process.on('SIGINT', async () => {
  await connection.close();
  console.log('Force to close the MongoDB connection');
  process.exit(0);
});
