/* @flow */

/*
 * This file re-exports graphql-compose basic methods.
 * This is done for obtaining static analysis with Flowtype
 * for TContext accross all resolvers in the schema.
 */

import type {
  MongooseSchema,
  MongooseDocument, // eslint-disable-line
} from 'mongoose';
import { SchemaComposer, ObjectTypeComposer } from 'graphql-compose';
import {
  composeWithMongoose as _composeWithMongoose,
  convertSchemaToGraphQL as _convertSchemaToGraphQL,
} from 'graphql-compose-mongoose/node8';

export { Resolver } from 'graphql-compose';

type TContext = {
  ip: string,
};

export const schemaComposer: SchemaComposer<TContext> = new SchemaComposer();

export function composeWithMongoose<TSource>(
  model: Class<TSource>,
  opts?: any
): ObjectTypeComposer<TSource, TContext> {
  return _composeWithMongoose(model, { schemaComposer, ...opts });
}
export function convertSchemaToGraphQL(
  ms: MongooseSchema<any>,
  typeName: string
): ObjectTypeComposer<any, TContext> {
  return _convertSchemaToGraphQL(ms, typeName, schemaComposer);
}
