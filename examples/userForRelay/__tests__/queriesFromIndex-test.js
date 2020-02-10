/* @flow */

import { graphql } from 'graphql';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import seed from '../data/seed';
import meta from '../index';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let mongoServer;
let con;
let db;
beforeAll(async () => {
  mongoServer = new MongodbMemoryServer({ instance: { dbName: 'userForRelay' } });
  const mongoUri = await mongoServer.getConnectionString();
  const opts = { useNewUrlParser: true };
  mongoose.connect(mongoUri, opts);
  con = await MongoClient.connect(mongoUri, opts);
  db = con.db('userForRelay');
  await seed(db);
  // take time to mongo create indexes if needed
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

afterAll(async () => {
  await mongoose.disconnect();
  con.close();
  mongoServer.stop();
});

it('check seed', async () => {
  expect((await db.listCollections().toArray()).map((o) => o.name)).toEqual(
    expect.arrayContaining(['userForRelay_users'])
  );
});

function findQueryByTitle(str) {
  const queryConfig = meta.queries.find((o) => o.title === str);
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  throw new Error(`Query not found by name: ${str}`);
}

describe('userForRelay > queries', () => {
  const alwaysSameResultTitles = ['Relay node', 'Relay Connection'];
  alwaysSameResultTitles.forEach((title) => {
    it(title, async () => {
      const result = await graphql({
        schema: meta.schema,
        source: findQueryByTitle(title),
      });
      expect(result).toMatchSnapshot();
    });
  });

  {
    const title = 'Create user mutation';
    it(title, async () => {
      const result = await graphql({
        schema: meta.schema,
        source: findQueryByTitle(title),
      });
      // $FlowFixMe
      expect(result.data.userCreate.record).toMatchSnapshot();
      // $FlowFixMe
      expect(result.data.userCreate.clientMutationId).toMatchSnapshot();
    });
  }
});
