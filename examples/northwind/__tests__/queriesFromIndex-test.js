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
  mongoose.connect(mongoUri);
  mongoose.connection.once('disconnected', () => {
    console.log('MongoDB disconnected!');
  });
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });
  await seed(db);
});

afterAll(async () => {
  await mongoose.disconnect();
  db.close();
  mongoServer.stop();
});

it('check seed', async () => {
  expect((await db.listCollections().toArray()).map(o => o.name)).toEqual(
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
