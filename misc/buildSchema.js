import fs from 'fs';
import path from 'path';
import Schema from '../graphqlSchema';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

async function buildSchema() {
  const result = await (graphql(Schema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, './schema.graphql.json'),
      JSON.stringify(result, null, 2)
    );
  }

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(__dirname, './schema.graphql.txt'),
    printSchema(Schema)
  );
}

buildSchema();
