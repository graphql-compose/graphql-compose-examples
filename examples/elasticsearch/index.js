import express from 'express';
import GraphqlSchema from './graphqlSchema';

export default {
  uri: '/elasticsearch',
  schema: GraphqlSchema,
  title: 'Elasticsearch REST API wrapper',
  description: 'This schema provides full API available in the <a href="https://github.com/elastic/elasticsearch-js" target="_blank">official elasticsearch module</a>.',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/elasticsearch',
  queries: [
    {
      title: 'Elastic search API 5.0',
      query: `
query {
  elastic50(host: "http://user:pass@example.com:9200") {
    search(q: "JavaScript")
  }
}
      `
    },
    {
      title: 'Elastic search API 2.4',
      query: `
query {
  elastic24(host: "http://user:pass@example.com:9200") {
    search(q: "JavaScript")
  }
}
      `
    },
    {
      title: 'Elastic search API 1.7',
      query: `
query {
  elastic17(host: "http://user:pass@example.com:9200") {
    search(q: "JavaScript")
  }
}
      `
    }
  ]
};
