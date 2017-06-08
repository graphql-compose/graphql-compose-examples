/* eslint-disable no-await-in-loop */
// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { getExampleNames, resolveExamplePath, mongoUri } from './config';

let db;
async function run() {
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });

  const exampleNames = getExampleNames();
  for (const name of exampleNames) {
    console.log(`Starting seed '${name}'...`);

    try {
      await new Promise((resolve, reject) => {
        fs.access(resolveExamplePath(name, 'data/seed.js'), fs.F_OK, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const seedFile = resolveExamplePath(name, 'data/seed.js');
      const seedFn = require(seedFile).default;
      await seedFn(db); // eslint-disable-line
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
