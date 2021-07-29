import { SchemaComposer } from 'graphql-compose';

// Creating own SchemaComposer instance, because in
// one node process we are using several graphql schemas.
export const schemaComposer = new SchemaComposer();
