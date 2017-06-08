import { graphql } from 'graphql';
import meta from '../index';

describe('nortwind > queries', () => {
  meta.queries.forEach(({ query, title }) => {
    it(title, async () => {
      const result = await graphql(meta.schema, query);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('nortwind > mutations', () => {
  // not sure how to test this, stub for now
})
