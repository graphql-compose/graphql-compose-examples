/* @flow */

import { graphql } from 'graphql';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import seed from '../data/seed';
import meta from '../index';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let mongoServer;
let db;
beforeAll(async () => {
  mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  const opts = { useMongoClient: true, promiseLibrary: Promise };
  mongoose.connect(mongoUri, opts);
  db = await MongoClient.connect(mongoUri, opts);
  await seed(db);
});

afterAll(async () => {
  await mongoose.disconnect();
  db.close();
  mongoServer.stop();
});

it('check seed', async () => {
  expect((await db.listCollections().toArray()).map(o => o.name)).toEqual(
    expect.arrayContaining(['userForRelay_users'])
  );
});

function findQueryByTitle(str) {
  const queryConfig = meta.queries.find(o => o.title === str);
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  return 'query not found';
}

describe('userForRelay > queries', () => {
  const alwaysSameResultTitles = ['Relay node', 'Relay Connection'];
  alwaysSameResultTitles.forEach(title => {
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
