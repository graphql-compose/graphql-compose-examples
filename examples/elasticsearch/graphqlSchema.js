import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import elasticsearch from 'elasticsearch';
import { TypeComposer, ComposeStorage } from 'graphql-compose';
import { ElasticApiParser } from 'graphql-compose-elasticsearch';

const GQC = new ComposeStorage();

const RootQueryTC = GQC.rootQuery();

RootQueryTC.setField('elastic50', {
  description: 'Elastic v5.0',
  type: new GraphQLObjectType({
    name: 'Elastic50',
    fields: new ElasticApiParser({ version: '5_0', prefix: 'Elastic50' }).run(),
  }),
  args: {
    host: {
      type: GraphQLString,
      defaultValue: 'http://user:pass@example.com:9200',
    },
  },
  resolve: (src, args, context) => {
    context.elasticClient = new elasticsearch.Client({ // eslint-disable-line no-param-reassign
      host: args.host,
      apiVersion: '5.0',
      requestTimeout: 5000,
    });
    return {};
  },
});

RootQueryTC.setField('elastic24', {
  description: 'Elastic v2.4',
  type: new GraphQLObjectType({
    name: 'Elastic24',
    fields: new ElasticApiParser({ version: '2_4', prefix: 'Elastic24' }).run(),
  }),
  args: {
    host: {
      type: GraphQLString,
      defaultValue: 'http://user:pass@example.com:9200',
    },
  },
  resolve: (src, args, context) => {
    context.elasticClient = new elasticsearch.Client({ // eslint-disable-line no-param-reassign
      host: args.host,
      apiVersion: '2.4',
      requestTimeout: 5000,
    });
    return {};
  },
});

RootQueryTC.setField('elastic17', {
  description: 'Elastic v1.7',
  type: new GraphQLObjectType({
    name: 'Elastic17',
    fields: new ElasticApiParser({ version: '5_0', prefix: 'Elastic17' }).run(),
  }),
  args: {
    host: {
      type: GraphQLString,
      defaultValue: 'http://user:pass@example.com:9200',
    },
  },
  resolve: (src, args, context) => {
    context.elasticClient = new elasticsearch.Client({ // eslint-disable-line no-param-reassign
      host: args.host,
      apiVersion: '1.7',
      requestTimeout: 5000,
    });
    return {};
  },
});

const graphqlSchema = GQC.buildSchema();
export default graphqlSchema;
