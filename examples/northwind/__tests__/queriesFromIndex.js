import meta from '../index';
import schema from '../graphqlSchema';
import { graphql } from 'graphql';

describe('nortwind > queries', () => {
  meta.queries.forEach(({ query, title }) => {
    it(title, async () => {
      const result = await graphql(meta.schema, query);
      expect(result).toMatchSnapshot();
    });
  });
});
