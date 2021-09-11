/* eslint-disable no-await-in-loop */
// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import { getExampleNames, resolveExamplePath, MONGODB_URI } from '../config';

function getDBName(uri: string) {
  const m = uri.match(/\d{5}\/([a-z0-9_-]{1,})/i);
  if (m && m[1]) return m[1];
  return 'graphql-compose-mongoose';
}

export async function mongoConnect(): Promise<Db & { con?: MongoClient }> {
  let db: Db & { con?: MongoClient };
  if (!db) {
    const con = await MongoClient.connect(MONGODB_URI);
    db = con.db(getDBName(MONGODB_URI));
    db.con = con;
  }
  return db;
}

export async function mongoDisconnect(db: Db & { con?: MongoClient }) {
  if (db?.con) {
    await db?.con.close();
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
    const db = await mongoConnect();
    await seedFn(db);
    await mongoDisconnect(db);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ENOENT') {
      console.log(`  file '${seedFile}' not found. Skipping...`);
    } else {
      console.log(e);
    }
  }
}
