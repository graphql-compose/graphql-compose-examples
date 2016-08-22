import express from 'express';
import GraphqlSchema from './graphqlSchema';

export default {
  uri: '/userForRelay',
  schema: GraphqlSchema,
  title: 'User for Relay: simple schema with one type.',
  description: 'This schema shows all available CRUD operations which are compatible with Relay.',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/userForRelay',
  queries: [
    {
      title: 'Relay node',
      query: `
{
  node(id: "VXNlcjo1N2JiNDRkZDIxZDJiZWZiN2NhM2YwMTA=") {
    ...on User {
      _id
      id
      name
      age
      gender
    }
  }
}
      `
    },
    {
      title: 'Relay Connection',
      query: `
{
  userConnection(first:3) {
    count
    edges {
      cursor
      node {
        _id
        id
        name
      }
    }
  }
}
      `
    },
    {
      title: 'Create user mutation',
      query: `
mutation {
  userCreate(input: {
    clientMutationId: "1",
    record: {
      name: "My Name",
      age: 24,
      gender: ladyboy,
      contacts: {
        email: "mail@example.com",
        phones: [
          "111-222-333-444",
          "444-555-666-777"
        ]
      }
    }
  }) {
    clientMutationId
    nodeId
    recordId
    record {
      name
      age
      gender
      contacts {
        email
        phones
      }
    }
  }
}
      `
    }
  ]
};
