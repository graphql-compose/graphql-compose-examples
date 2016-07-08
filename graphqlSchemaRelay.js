import { TypeComposer } from 'graphql-compose';
import mongooseToTypeComposer from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

// STEP 1: DEFINE MONGOOSE SCHEMA AND MODEL
import UserModel from './mongooseUserModel';


// STEP 2.1: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity
const userTypeComposer = mongooseToTypeComposer(UserModel, customizationOptions);
// get list of 12 Resolvers (findById, updateMany and others)
const resolvers = userTypeComposer.getResolvers();

// STEP 2.2: Wrap with Relay
composeWithRelay(userTypeComposer);


// STEP 3: CREATE CRAZY GraphQL SCHEMA WITH ALL CRUD USER OPERATIONS
// via graphql-compose it will be much much easier, with less typing
const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    userById: resolvers.get('findById').getFieldConfig(),
    userByIds: resolvers.get('findByIds').getFieldConfig(),
    userOne: resolvers.get('findOne').getFieldConfig(),
    userMany: resolvers.get('findMany').getFieldConfig(),
    userCount: resolvers.get('count').getFieldConfig(),
  },
});

composeWithRelay(new TypeComposer(rootQuery));

const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    userCreate: resolvers.get('createOne').getFieldConfig(),
    userUpdateById: resolvers.get('updateById').getFieldConfig(),
    userUpdateOne: resolvers.get('updateOne').getFieldConfig(),
    userUpdateMany: resolvers.get('updateMany').getFieldConfig(),
    userRemoveById: resolvers.get('removeById').getFieldConfig(),
    userRemoveOne: resolvers.get('removeOne').getFieldConfig(),
    userRemoveMany: resolvers.get('removeMany').getFieldConfig(),
  },
});

const graphqlSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

export default graphqlSchema;
