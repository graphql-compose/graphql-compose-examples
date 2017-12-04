/* @flow */

import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import { mainPage, addToMainPage } from './mainPage';
import { expressPort, getExampleNames, resolveExamplePath } from './config';
import './mongooseConnection';

const server = express();
server.use(cors());

// scan `examples` directory and add
// - graphql endpoint by uri /exampleDirName
// - links and example queries to index page
const exampleNames = getExampleNames();
for (const name of exampleNames) {
  addExample(
    // $FlowFixMe
    require(resolveExamplePath(name)).default,
    name
  );
}

// $FlowFixMe
server.get('/', (req, res) => {
  res.send(mainPage());
});

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});

function addExample(example, uri) {
  example.uri = `/${uri}`; // eslint-disable-line
  server.use(
    example.uri,
    graphqlHTTP(() => ({
      schema: example.schema,
      graphiql: true,
      formatError: error => ({
        message: error.message,
        stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
      }),
    }))
  );
  server.get(`${example.uri}-playground`, expressPlayground({ endpoint: example.uri }));
  addToMainPage(example);
}
