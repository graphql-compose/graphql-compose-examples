import { graphql } from 'graphql';
import meta from '../index';

describe('elasticsearch > queries', () => {
  meta.queries.forEach(({ query, title }) => {
    it(title, async () => {
      const result = await graphql({
        schema: meta.schema,
        source: query,
        contextValue: {},
      });
      expect(result).toMatchSnapshot();
    });
  });
});
