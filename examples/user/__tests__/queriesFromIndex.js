import meta from '../index';
import schema from '../graphqlSchema';
import { graphql } from 'graphql';

function findQueryByTitle(str) {
  const queryConfig = meta.queries.find(o => o.title === str);
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  return 'query not found';
}

describe('user > queries', () => {
  const alwaysSameResultTitles = [
    'Find by id',
    'Find one User',
    'Find many Users',
    'Find User with field of MIXED type',
  ];
  alwaysSameResultTitles.forEach((title) => {
    it(title, async () => {
      const result = await graphql(meta.schema, findQueryByTitle(title));
      expect(result).toMatchSnapshot();
    });
  });

  {
    const title = 'Create user mutation (with arg of MIXED type)';
    it(title, async () => {
      const result = await graphql(meta.schema, findQueryByTitle(title));
      expect(result.data.userCreate.record).toMatchSnapshot();
    });
  }
});
