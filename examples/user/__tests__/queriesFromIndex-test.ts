import { graphql } from 'graphql';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import seed from '../data/seed';
import meta from '../index';

let mongoServer: MongoMemoryServer;
let con;
let db;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'user' } });
  const mongoUri = mongoServer.getUri('user');
  mongoose.connect(mongoUri, { autoIndex: false });
  con = await MongoClient.connect(mongoUri);
  db = con.db('user');
  await seed(db);
  await Promise.all(
    mongoose.modelNames().map((m) => mongoose.models[m].ensureIndexes({ background: false }))
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  con.close();
  mongoServer.stop();
});

it('check seed', async () => {
  expect((await db.listCollections().toArray()).map((o) => o.name)).toEqual(
    expect.arrayContaining(['user_users'])
  );
});

function findQueryByTitle(str) {
  const queryConfig = meta.queries.find((o) => o.title === str);
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  throw new Error(`Query not found by name: ${str}`);
}

describe('user > queries', () => {
  const alwaysSameResultTitles = [
    'Find by id',
    'Find one User',
    'Find many Users',
    'Find User with field of MIXED type',
    'Pagination',
  ];
  alwaysSameResultTitles.forEach((title) => {
    it(title, async () => {
      const result = await graphql(meta.schema, findQueryByTitle(title));
      expect(result).toMatchSnapshot();
    });
  });

  {
    const title = 'Create user mutation (with arg of MIXED type)';
    it(title, async () => {
      const result: any = await graphql(meta.schema, findQueryByTitle(title));
      expect(result?.data?.userCreate?.record).toMatchSnapshot();
    });
  }
});
