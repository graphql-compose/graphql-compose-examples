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
  mongoServer = await MongoMemoryServer.create({
    instance: { dbName: 'user', storageEngine: 'wiredTiger' },
  });
  const mongoUri = mongoServer.getUri('northwind');
  mongoose.connect(mongoUri, { autoIndex: false });
  con = await MongoClient.connect(mongoUri);
  mongoose.connection.once('disconnected', () => {
    console.log('MongoDB disconnected!');
  });
  con = await MongoClient.connect(mongoUri);
  db = con.db('northwind');
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
    expect.arrayContaining([
      'northwind_customers',
      'northwind_products',
      'northwind_regions',
      'northwind_orders',
      'northwind_employees',
      'northwind_categories',
      'northwind_shippers',
      'northwind_suppliers',
    ])
  );
});

describe('nortwind > queries', () => {
  meta.queries.forEach(({ query, title }) => {
    it(title, async () => {
      const result = await graphql(meta.schema, query);
      expect(result).toMatchSnapshot();
    });
  });
});
