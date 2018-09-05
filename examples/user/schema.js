/* @flow */

// SINGLE SCHEMA ON SERVER
// import { schemaComposer } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// import { SchemaComposer } from 'graphql-compose';
// const schemaComposer = new SchemaComposer();

import { schemaComposer } from './schemaComposer';
import { UserTC } from './models/user';

// create GraphQL Schema with all available resolvers for User Type
schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'), // .debug(), // debug info to console for this resolver
  userTotal: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination'),
});

// For debug purposes you may display resolver internals in the following manner:
// console.log(UserTC.getResolver('findMany').toString());

schemaComposer.Mutation.addFields({
  userCreate: UserTC.getResolver('createOne'),
  userCreateMany: UserTC.getResolver('createMany'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
