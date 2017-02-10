import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { mainPage, addToMainPage } from './mainPage';
import { expressPort, getExampleNames, resolveExamplePath } from './config';
import './mongooseConnection';

const server = express();
server.use(cors());

// scan `examples` directory and add
// - graphql endpoint by uri /exampleDirName
// - links and example queries to index page
const exampleNames = getExampleNames();
for (let name of exampleNames) {
  addExample(
    require(resolveExamplePath(name)).default,
    name
  );
}

server.get('/', (req, res) => {
  res.send(mainPage());
});


server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});


function addExample(example, uri) {
  example.uri = `/${uri}`;
  server.use(example.uri, graphqlHTTP(req => ({
    schema: example.schema,
    graphiql: true,
    formatError: (error) => ({
      message: error.message,
      stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
    }),
  })));
  addToMainPage(example);
}
