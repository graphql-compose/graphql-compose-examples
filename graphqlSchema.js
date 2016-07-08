import mongooseToTypeComposer from 'graphql-compose-mongoose';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

// STEP 1: DEFINE MONGOOSE SCHEMA AND MODEL
import UserModel from './mongooseUserModel';


// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity
const typeComposer = mongooseToTypeComposer(UserModel, customizationOptions);
// get list of 12 Resolvers (findById, updateMany and others)
const resolvers = typeComposer.getResolvers();

// typeComposer from (graphql-compose) provide bunch if useful methods
// for modifying GraphQL Types (eg. add/remove fields, relate with other types,
// restrict access due context).


// STEP 3: CREATE CRAZY GraphQL SCHEMA WITH ALL CRUD USER OPERATIONS
// via graphql-compose it will be much much easier, with less typing
const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      userById: resolvers.get('findById').getFieldConfig(),
      userByIds: resolvers.get('findByIds').getFieldConfig(),
      userOne: resolvers.get('findOne').getFieldConfig(),
      userMany: resolvers.get('findMany').getFieldConfig(),
      userCount: resolvers.get('count').getFieldConfig(),
    },
  }),
  mutation: new GraphQLObjectType({
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
  }),
});

export default graphqlSchema;
