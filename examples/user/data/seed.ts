import fs from 'fs';
import { ObjectId, Decimal128 } from 'mongodb';

const collectionPrefix = 'user_';

export default async function seed(db: any) {
  const files = ['users'];

  const collectionNames = (await db.listCollections().toArray()).map((o) => o.name);

  return Promise.all(
    files.map((file) => {
      return (async function () {
        const colName = `${collectionPrefix || ''}${file}`;
        const data = JSON.parse(fs.readFileSync(`${__dirname}/${file}.json`, 'utf8'));
        data.forEach((_, i) => {
          data[i]._id = ObjectId.createFromHexString(data[i]._id);
          data[i].salaryDecimal = Decimal128.fromString(data[i].salaryDecimal);
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
