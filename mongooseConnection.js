/* @flow */

import mongoose from 'mongoose';
import { mongoUri } from './config';

mongoose.Promise = Promise;

const opts = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useMongoClient: true,
};

mongoose.connect(mongoUri, opts);

export const { connection } = mongoose;
connection.on('error', e => {
  if (e.message.code === 'ETIMEDOUT') {
    console.log(e);
    mongoose.connect(mongoUri, opts);
  }
  console.log(e);
});
connection.once('open', () => {
  console.log(`MongoDB successfully connected to ${mongoUri}`);
});
