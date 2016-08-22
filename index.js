import express from 'express';
import graphqlHTTP from 'express-graphql';
import { mainPage, addToMainPage } from './mainPage';
import './mongooseConnection';

const server = express();

import user from './examples/user';
addExample(user);

import userForRelay from './examples/userForRelay';
addExample(userForRelay);

import northwind from './examples/northwind';
addExample(northwind);

server.get('/', (req, res) => {
  res.send(mainPage());
});

const expressPort = process.env.PORT || 3000;
server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});


function addExample(example) {
  server.use(example.uri, graphqlHTTP(req => ({
    schema: example.schema,
    graphiql: true,
    formatError: (error) => ({
      message: error.message,
      stack: error.stack.split('\n'),
    }),
  })));
  addToMainPage(example);
}
