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
  mongoose.connect(mongoUri);
  con = await MongoClient.connect(mongoUri);
  db = con.db('user');
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
    expect.arrayContaining(['md_characters'])
  );
});

function findQueryByTitle(str) {
  const queryConfig = meta.queries.find((o) => o.title === str);
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  throw new Error(`Query not found by name: ${str}`);
}

describe('mongooseDiscriminators > queries', () => {
  const alwaysSameResultTitles = ['Find many with fragments on Interface type'];
  alwaysSameResultTitles.forEach((title) => {
    it(title, async () => {
      const result = await graphql(meta.schema, findQueryByTitle(title));
      expect(result).toMatchSnapshot();
    });
  });
});
