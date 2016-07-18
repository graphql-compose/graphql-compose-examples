import express from 'express';
import graphqlHTTP from 'express-graphql';
import GraphQLSchema from './graphqlSchema';
import GraphQLSchemaRelay from './graphqlSchemaRelay';
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

server.use('/mongoose', graphqlHTTP(req => ({
  schema: GraphQLSchema,
  graphiql: true,
  formatError: (error) => ({
    message: error.message,
    stack: error.stack.split('\n'),
  }),
})));

server.use('/mongoose-relay', graphqlHTTP(req => ({
  schema: GraphQLSchemaRelay,
  graphiql: true,
  formatError: (error) => ({
    message: error.message,
    stack: error.stack.split('\n'),
  }),
})));

server.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Graphql-compose examples</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1>Graphql-compose examples</h1>
          <a href="/mongoose?query=%7B%0A%20%20userMany(limit%3A%205)%20%7B%0A%20%20%20%20_id%0A%20%20%20%20name%0A%20%20%20%20age%0A%20%20%7D%0A%7D">Vanilla mongoose schema</a><br/>
          <a href="/mongoose-relay?query=%7B%0A%20%20userConnection(first%3A3)%20%7B%0A%20%20%20%20count%0A%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20cursor%0A%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20_id%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D">Mongoose schema with Relay</a><br/>
        </div>
      </body>
    </html>
  `)
});

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
