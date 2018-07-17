/* @flow */
/* eslint-disable no-await-in-loop */
// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { getExampleNames, resolveExamplePath, mongoUri } from '../config';

function getDBName(uri: string) {
  const m = uri.match(/\d{5}\/([a-z0-9_-]{1,})/i);
  if (m && m[1]) return m[1];
  return 'graphql-compose-mongoose';
}

let db;
async function run() {
  const con = await MongoClient.connect(
    mongoUri,
    { useNewUrlParser: true }
  );

  db = con.db(getDBName(mongoUri));

  const exampleNames = getExampleNames();
  for (const name of exampleNames) {
    console.log(`Starting seed '${name}'...`);

    const seedFile = resolveExamplePath(name, 'data/seed.js');
    try {
      await new Promise((resolve, reject) => {
        fs.access(seedFile, fs.F_OK, err => {
          if (err) reject(err);
          else resolve();
        });
      });

      // $FlowFixMe
      const seedFn = require(seedFile).default;
      await seedFn(db); // eslint-disable-line
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ENOENT') {
        console.log(`  file '${seedFile}' not found. Skipping...`);
      } else {
        console.log(e);
      }
    }
  }

  console.log('Seed competed!');
  con.close();
}

run().catch(e => {
  console.log(e);
  process.exit(0);
});
