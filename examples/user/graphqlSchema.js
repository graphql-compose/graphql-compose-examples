/* @flow */
// SINGLE SCHEMA ON SERVER
// import { GQC } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// create new GQC from ComposeStorage
import { ComposeStorage } from 'graphql-compose';
import { UserTC } from './models/user';

const GQC = new ComposeStorage();

// create GraphQL Schema with all available resolvers for User Type
GQC.rootQuery().addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'), // .debug(), // debug info to console for this resolver
  userTotal: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
});

// For debug purposes you may display resolver internals in the following manner:
// console.log(UserTC.getResolver('findMany').toString());

GQC.rootMutation().addFields({
  userCreate: UserTC.getResolver('createOne'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),
});

const graphqlSchema = GQC.buildSchema();
export default graphqlSchema;
