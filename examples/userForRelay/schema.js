/* @flow */

import { schemaComposer, composeWithRelay } from './schemaComposer';
import { UserTC } from './models/user';

composeWithRelay(schemaComposer.Query);

schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userTotal: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination'),
});

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

UserTC.setField('staticAnalysisDemoField', {
  type: 'String',
  resolve: (source, args, context, info) => {
    return source.contacts.email + context.ip + info.fieldName;
  },
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
