import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { altairExpress } from 'altair-express-middleware';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { mainPage, addToMainPage } from './mainPage';
import { PORT, getExampleNames, resolveExamplePath } from './config';
import './mongooseConnection';

const app = express();
app.use(cors({ origin: true, credentials: true }));
const httpServer = http.createServer(app);

// scan `examples` directory and add
// - graphql endpoint by uri /exampleDirName
// - links and example queries to index page
const exampleNames = getExampleNames();
for (const name of exampleNames) {
  addExample(
    require(resolveExamplePath(name)).default,
    name
  );
}

// $FlowFixMe
app.get('/', (req, res) => {
  res.send(mainPage());
});

httpServer.listen(PORT, () => {
  console.log(`🚀🚀🚀 The server is running at http://localhost:${PORT}/`);

  // https://www.apollographql.com/docs/graphql-subscriptions/setup/
  SubscriptionServer.create(
    {
      schema: require('./examples/northwind/schema').default,
      execute,
      subscribe,
      onConnect: (connectionParams, ws, context) => {
        console.log(`WS[connect][${context.request.connection.remoteAddress}]`, connectionParams);
      },
      onDisconnect: (ws, context) => {
        console.log(`WS[disconn][${context.request.connection.remoteAddress}]`);
      },
    },
    {
      server: httpServer,
      path: '/northwind',
    }
  );
});

function addExample(example, uri) {
  example.uri = `/${uri}`;

  const server = new ApolloServer({
    schema: example.schema,
    introspection: true,
    playground: {
      subscriptionEndpoint: process.env.SUBSCRIPTION_ENDPOINT || `ws://localhost:${PORT}/northwind`,
    },
    plugins: example.plugins,
  });
  server.applyMiddleware({ app: app as any, path: example.uri });

  app.use(
    `${example.uri}-altair`,
    altairExpress({
      endpointURL: example.uri,
      subscriptionsEndpoint:
        process.env.SUBSCRIPTION_ENDPOINT || `ws://localhost:${PORT}/northwind`,
    })
  );
  app.use(`${example.uri}-voyager`, voyagerMiddleware({ endpointUrl: example.uri }));
  addToMainPage(example);
}
