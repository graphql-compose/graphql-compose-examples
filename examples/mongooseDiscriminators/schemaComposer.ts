// SINGLE SCHEMA ON SERVER
// import { schemaComposer } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// import { SchemaComposer } from 'graphql-compose';
// const schemaComposer = new SchemaComposer();

import { SchemaComposer } from 'graphql-compose';

export type TContext = {
  ip: string;
};

export const schemaComposer: SchemaComposer<TContext> = new SchemaComposer();
