import { graphql } from 'graphql';
import meta from '../index';

function findQueryByTitle(str) {
  const queryConfig = meta.queries.find(o => o.title === str);
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  return 'query not found';
}

describe('userForRelay > queries', () => {
  const alwaysSameResultTitles = [
    'Relay node',
    'Relay Connection',
  ];
  alwaysSameResultTitles.forEach((title) => {
    it(title, async () => {
      const result = await graphql(meta.schema, findQueryByTitle(title));
      expect(result).toMatchSnapshot();
    });
  });

  {
    const title = 'Create user mutation';
    it(title, async () => {
      const result = await graphql(meta.schema, findQueryByTitle(title));
      expect(result.data.userCreate.record).toMatchSnapshot();
      expect(result.data.userCreate.clientMutationId).toMatchSnapshot();
    });
  }
});
