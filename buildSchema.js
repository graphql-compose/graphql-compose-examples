import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

async function buildSchema(schemaPath) {
  const Schema = require(`${schemaPath}/graphqlSchema`).default;
  const result = await (graphql(Schema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(schemaPath, './data/schema.graphql.json'),
      JSON.stringify(result, null, 2)
    );
    console.log(`  write file ${path.join(schemaPath, './data/schema.graphql.json')}`);
  }

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(schemaPath, './data/schema.graphql.txt'),
    printSchema(Schema)
  );
  console.log(`  write file ${path.join(schemaPath, './data/schema.graphql.txt')}`);
}

async function run() {
  console.log('Building schema for `user`...');
  await buildSchema(path.resolve('./examples/user'));

  console.log('Building schema for `userForRelay`...');
  await buildSchema(path.resolve('./examples/userForRelay'));

  console.log('Building schema for `northwind`...');
  await buildSchema(path.resolve('./examples/northwind'));

  console.log('Building schemas competed!');
};

run().catch(e => {
  console.log(e);
  process.exit(0);
});
