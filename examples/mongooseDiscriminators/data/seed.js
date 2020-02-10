/* @flow */

import fs from 'fs';
import { ObjectID } from 'mongodb';

const collectionPrefix = 'md_';

export default async function seed(db: any) {
  const files = ['characters'];

  const collectionNames = (await db.listCollections().toArray()).map((o) => o.name);

  return Promise.all(
    files.map((file) => {
      return (async function() {
        const colName = `${collectionPrefix || ''}${file}`;
        const data = JSON.parse(fs.readFileSync(`${__dirname}/${file}.json`, 'utf8'));
        data.forEach((d, i) => {
          data[i]._id = ObjectID.createFromHexString(data[i]._id);
        });
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
