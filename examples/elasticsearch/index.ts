import schema from './schema';

export default {
  uri: '/elasticsearch',
  schema,
  title: 'Elasticsearch REST API wrapper',
  description:
    'This schema provides full API available in the <a href="https://github.com/elastic/elasticsearch-js" target="_blank">official elasticsearch module</a>.',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/elasticsearch',
  queries: [
    {
      title: 'Elastic search API 7.7',
      query: `
query {
  elastic77(host: "http://user:pass@example.com:9200") {
    search(q: "JavaScript")
  }
}
      `,
    },
    {
      title: 'Elastic search API 6.8',
      query: `
query {
  elastic68(host: "http://user:pass@example.com:9200") {
    search(q: "JavaScript")
  }
}
      `,
    },
    {
      title: 'Elastic search API 5.6',
      query: `
query {
  elastic56(host: "http://user:pass@example.com:9200") {
    search(q: "JavaScript")
  }
}
      `,
    },
  ],
};
