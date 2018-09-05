/* @flow */

/*
* This file re-exports graphql-compose basic methods.
* This is done for obtaining static analysis with Flowtype
* for TContext accross all resolvers in the schema.
*/

import type { MongooseSchema } from 'mongoose';
import { SchemaComposer } from 'graphql-compose';
import { composeWithRelay } from 'graphql-compose-relay';
import {
  composeWithMongoose as _composeWithMongoose,
  convertSchemaToGraphQL as _convertSchemaToGraphQL,
} from 'graphql-compose-mongoose/node8';

type TContext = {
  ip: string,
};

const schemaComposer: SchemaComposer<TContext> = new SchemaComposer();
const { TypeComposer, InputTypeComposer, EnumTypeComposer, Resolver } = schemaComposer;
export { schemaComposer, TypeComposer, InputTypeComposer, EnumTypeComposer, Resolver };

export function composeWithMongoose(model: Object, opts?: any): TypeComposer {
  return _composeWithMongoose(model, { schemaComposer, ...opts });
}
export function convertSchemaToGraphQL(ms: MongooseSchema<any>, typeName: string): TypeComposer {
  return _convertSchemaToGraphQL(ms, typeName, schemaComposer);
}

export { composeWithRelay };
