import express from 'express';
import graphqlHTTP from 'express-graphql';
import GraphQLSchema from './graphqlSchema';
import mongoose from 'mongoose';

const expressPort = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-compose-mongoose';

mongoose.connect(mongoUri);
const db = mongoose.connection;
db.on('error', (e) => {
  if (e.message.code === 'ETIMEDOUT') {
    console.log(e);
    mongoose.connect(mongoUri, opts);
  }
  console.log(e);
});
db.once('open', () => {
  console.log(`MongoDB successfully connected to ${mongoUri}`);
});


const server = express();
const graphQLMiddleware = graphqlHTTP(req => ({
  schema: GraphQLSchema,
  graphiql: true,
  pretty: true,
  formatError: (error) => ({
    message: error.message,
    stack: error.stack.split('\n'),
  }),
}));

server.use('/', graphQLMiddleware);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
