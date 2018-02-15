/* @flow */

/*
* This file re-exports graphql-compose basic methods.
* This is done for obtaining static analysis with Flowtype
* for TContext accross all resolvers in the schema.
*/

import { SchemaComposer } from 'graphql-compose';
import { composeWithRelay } from 'graphql-compose-relay';
import { composeWithMongoose as _composeWithMongoose } from 'graphql-compose-mongoose/node8';

type TContext = {
  ip: string,
};

const GQC: SchemaComposer<TContext> = new SchemaComposer();
const { TypeComposer, InputTypeComposer, EnumTypeComposer, Resolver } = GQC;
export { GQC, TypeComposer, InputTypeComposer, EnumTypeComposer, Resolver };

export const composeWithMongoose: (*, *) => TypeComposer = _composeWithMongoose;
export { composeWithRelay };
