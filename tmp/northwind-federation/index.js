/* eslint-disable */

import dedent from 'dedent';
import schema from './schema';

export default {
  uri: '/northwind-federation',
  schema: schema,
  title: 'Northwind: as Apollo Federation Service',
  description:
    'This is a sample data of some trading company, which consists from 8 models. All models has cross-relations to each other.',
  github:
    'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/northwind-federation',
  queries: [
    {
      title: 'Self referenced Employee Type',
      query: dedent`
        {
          viewer {
            employeeList {
              firstName
              subordinates {
                firstName
              }
              chief {
                firstName
              }
            }
          }
        }
      `,
    },
  ],
};
