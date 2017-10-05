/* @flow */

import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import { getExampleNames, resolveExamplePath } from '../config';

async function buildSchema(schemaPath) {
  // $FlowFixMe
  const Schema = require(`${schemaPath}/graphqlSchema`).default; // eslint-disable-line
  const result = await graphql(Schema, introspectionQuery);
  if (result.errors) {
    console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2));
  } else {
    const jsonFile = path.join(schemaPath, './data/schema.graphql.json');
    fs.writeFileSync(jsonFile, JSON.stringify(result, null, 2));
    console.log(`  write file ${jsonFile}`);
  }

  // Save user readable type system shorthand of schema
  const gqlFile = path.join(schemaPath, './data/schema.graphql');
  fs.writeFileSync(gqlFile, printSchema(Schema));
  console.log(`  write file ${gqlFile}`);
}

async function run() {
  const exampleNames = getExampleNames();
  for (const name of exampleNames) {
    console.log(`Building schema for '${name}'...`);
    await buildSchema(resolveExamplePath(name)); // eslint-disable-line
  }

  console.log('Building schemas competed!');
}

run().catch(e => {
  console.log(e);
  process.exit(0);
});
