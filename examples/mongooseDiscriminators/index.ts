import schema from './schema';

export default {
  uri: '/mongooseDiscriminators',
  schema,
  title: 'Mongoose Discriminators',
  description:
    'Person and Droid models build on top of Character model. All data stored in one collection, correct document type obtained from discriminatorKey field. <b><a href="http://mongoosejs.com/docs/discriminators.html" target="_blank">Mongoose discriminator docs <span class="glyphicon glyphicon-new-window"></span></a></b>',
  github:
    'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/mongooseDiscriminators',
  queries: [
    {
      title: 'Find many with fragments on Interface type',
      query: `
  query {
    characterMany {
      __typename
      name
      ...on Droid {
        makeDate
      }
      ...on Person {
        hairColor
      }
    }
    personMany {
      name
      hairColor
    }
    droidMany {
      name
      makeDate
    }
  }
      `,
    },
  ],
};
