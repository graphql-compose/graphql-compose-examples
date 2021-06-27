import elasticsearch from 'elasticsearch';
import { SchemaComposer } from 'graphql-compose';
import { ElasticApiParser } from 'graphql-compose-elasticsearch';

function checkHost(host): void {
  if (host === 'http://user:pass@example.com:9200') {
    throw new Error(
      "✋ 🛑 I don't have public elasticsearch instance for demo purposes. \n" +
        '🚀 Demo will work if you provide public elasticsearch instance url \n' +
        '🚀 in query argument `host: "http://user:pass@example.com:9200"` \n'
    );
  }
}

const schemaComposer = new SchemaComposer();

schemaComposer.Query.setField('elastic77', {
  description: 'Elastic v7.7',
  type: schemaComposer.createObjectTC({
    name: 'Elastic77',
    fields: new ElasticApiParser({ apiVersion: '7.7', prefix: 'Elastic77' }).generateFieldMap(),
  }),
  args: {
    host: {
      type: 'String',
      defaultValue: 'http://user:pass@example.com:9200',
    },
  },
  resolve: (src, args, context) => {
    checkHost(args.host);
    context.elasticClient = new elasticsearch.Client({
      // eslint-disable-line no-param-reassign
      host: args.host,
      apiVersion: '7.7',
      requestTimeout: 5000,
    });
    return {};
  },
});

schemaComposer.Query.setField('elastic68', {
  description: 'Elastic v6.8',
  type: schemaComposer.createObjectTC({
    name: 'Elastic60',
    fields: new ElasticApiParser({ apiVersion: '6.8', prefix: 'Elastic68' }).generateFieldMap(),
  }),
  args: {
    host: {
      type: 'String',
      defaultValue: 'http://user:pass@example.com:9200',
    },
  },
  resolve: (src, args, context) => {
    checkHost(args.host);
    context.elasticClient = new elasticsearch.Client({
      // eslint-disable-line no-param-reassign
      host: args.host,
      apiVersion: '6.8',
      requestTimeout: 5000,
    });
    return {};
  },
});

schemaComposer.Query.setField('elastic56', {
  description: 'Elastic v5.6',
  type: schemaComposer.createObjectTC({
    name: 'Elastic56',
    fields: new ElasticApiParser({ apiVersion: '5.6', prefix: 'Elastic56' }).generateFieldMap(),
  }),
  args: {
    host: {
      type: 'String',
      defaultValue: 'http://user:pass@example.com:9200',
    },
  },
  resolve: (src, args, context) => {
    checkHost(args.host);
    context.elasticClient = new elasticsearch.Client({
      // eslint-disable-line no-param-reassign
      host: args.host,
      apiVersion: '5.6',
      requestTimeout: 5000,
    });
    return {};
  },
});

const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;
