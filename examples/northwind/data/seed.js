/* @flow */

import fs from 'fs';

const collectionPrefix = 'northwind_';

export default async function seed(db: any) {
  const files = [
    'categories',
    'customers',
    'employees',
    'orders',
    'products',
    'regions',
    'shippers',
    'suppliers',
  ];

  const collectionNames = (await db.listCollections().toArray()).map((o) => o.name);

  return Promise.all(
    files.map((file) => {
      return (async function () {
        const colName = `${collectionPrefix || ''}${file}`;
        const data = JSON.parse(fs.readFileSync(`${__dirname}/json/${file}.json`, 'utf8'));
        if (collectionNames.indexOf(colName) > -1) {
          console.log(`  '${colName}' dropped`);
          await db.dropCollection(colName);
        }
        const result = await db.collection(colName).insertMany(data);
        console.log(`  '${colName}' created with ${result.insertedCount} records`);
      })();
    })
  );
}
