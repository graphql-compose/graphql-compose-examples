import express from 'express';
import GraphqlSchema from './graphqlSchema';

export default {
  uri: '/user',
  schema: GraphqlSchema,
  title: 'User: simple schema with one type.',
  description: 'This schema implements all 13 CRUD operations available in graphql-compose-mongoose.',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/user',
  queries: [
    {
      title: 'Find by id',
      query: `
{
  userById(_id: "57bb44dd21d2befb7ca3f010") {
    _id
    name
    languages {
      language
      skill
    }
    contacts {
      email
    }
    gender
    age
  }
}
      `
    },
    {
      title: 'Find one User',
      query: `
{
  userOne(filter: { age: 18 }) {
    name
    languages {
      language
      skill
    }
    contacts {
      email
    }
    gender
    age
  }
}
      `
    },
    {
      title: 'Find many Users',
      query: `
{
  userMany(filter: { gender: male }) {
    name
    languages {
      language
      skill
    }
    contacts {
      email
    }
    gender
    age
  }
}
      `
    },
    {
      title: 'Create user mutation',
      query: `
mutation {
  userCreate(record: {
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
  }) {
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
