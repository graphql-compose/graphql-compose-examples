import { Resolver } from 'graphql-compose';

export function addQueryToPayload(resolvers: { [name: string]: Resolver<any, any, any> }) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k].getOTC().setField('query', {
      type: 'Query',
      resolve: () => ({}),
    });
  });
  return resolvers;
}
