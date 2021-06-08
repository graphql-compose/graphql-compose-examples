/* eslint-disable no-await-in-loop */
// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { getExampleNames, resolveExamplePath, MONGODB_URI } from '../config';

function getDBName(uri: string) {
  const m = uri.match(/\d{5}\/([a-z0-9_-]{1,})/i);
  if (m && m[1]) return m[1];
  return 'graphql-compose-mongoose';
}

let con;
let db;

async function mongoConnect() {
  if (!db) {
    con = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = con.db(getDBName(MONGODB_URI));
  }
  return db;
}

async function mongoDisconnect() {
  if (con) {
    const oldCon = con;
    con = undefined;
    db = undefined;
    await oldCon.close();
  }
}

export async function seedAll() {
  const exampleNames = getExampleNames();
  for (const name of exampleNames) {
    await seedByName(name);
  }
  console.log('Seed competed!');
}

export async function seedByName(name: string) {
  console.log(`Starting seed '${name}'...`);

  const seedFile = resolveExamplePath(name, 'data/seed.ts');
  try {
    await new Promise((resolve, reject) => {
      fs.access(seedFile, (fs as any).F_OK, (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const seedFn = require(seedFile).default;
    await mongoConnect();
    await seedFn(db);
    await mongoDisconnect();
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ENOENT') {
      console.log(`  file '${seedFile}' not found. Skipping...`);
    } else {
      console.log(e);
    }
  }
}
