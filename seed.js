// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { getExampleNames, resolveExamplePath, mongoUri } from './config';

let db;
async function run() {
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });

  const exampleNames = getExampleNames();
  for (let name of exampleNames) {
    console.log(`Starting seed '${name}'...`);
    const seedFile = resolveExamplePath(name, 'data/seed.js');
    try {
      fs.accessSync(seedFile, fs.F_OK);
      let seedFn = require(seedFile).default;
      await seedFn(db);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        console.log(`  file '${seedFile}' not found. Skipping...`);
      } else {
        console.log(e);
      }
    }
  }

  console.log('Seed competed!');
  db.close();
};

run().catch(e => {
  console.log(e);
  process.exit(0);
});
