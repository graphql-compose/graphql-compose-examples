// SINGLE SCHEMA ON SERVER
// import { schemaComposer } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// import { SchemaComposer } from 'graphql-compose';
// const schemaComposer = new SchemaComposer();

import { PubSub } from 'apollo-server-express';
import { schemaComposer } from 'graphql-compose';
import { CategoryTC } from './models/category';
import { CustomerTC } from './models/customer';
import { EmployeeTC } from './models/employee';
import { OrderTC, Order } from './models/order';
import { ProductTC } from './models/product';
import { RegionTC } from './models/region';
import { ShipperTC } from './models/shipper';
import { SupplierTC } from './models/supplier';
// import { allowOnlyForLocalhost } from './wrappers/allowOnlyForLocalhost';
import { addQueryToPayload } from './wrappers/addQueryToPayload';
import { autoResetDataIn30min } from './wrappers/autoResetDataIn30min';
import { seedByName } from '../../scripts/seedHelpers';
import { FunctifiedAsync } from './FunctifiedAsync';

// see more PubSubs here https://www.apollographql.com/docs/apollo-server/data/subscriptions/#pubsub-implementations
const pubsub = new PubSub();

const ViewerTC = schemaComposer.getOrCreateOTC('Viewer');
schemaComposer.Query.addFields({
  viewer: {
    type: ViewerTC.getType(),
    description: 'Data under client context',
    resolve: () => ({}),
  },
});

const fields = {
  category: CategoryTC.getResolver('findOne'),
  categoryList: CategoryTC.getResolver('findMany'),

  customer: CustomerTC.getResolver('findOne'),
  customerPagination: CustomerTC.getResolver('pagination'),
  customerConnection: CustomerTC.getResolver('connection'),

  employee: EmployeeTC.getResolver('findOne'),
  employeeList: EmployeeTC.getResolver('findMany'),
  employeePagination: EmployeeTC.getResolver('pagination'),

  order: OrderTC.getResolver('findOne'),
  orderPagination: OrderTC.getResolver('pagination'),
  orderConnection: OrderTC.getResolver('connection'),

  product: ProductTC.getResolver('findOne'),
  productList: ProductTC.getResolver('findMany'),
  productPagination: ProductTC.getResolver('pagination'),
  productConnection: ProductTC.getResolver('connection'),

  region: RegionTC.getResolver('findOne'),
  regionList: RegionTC.getResolver('findMany'),

  shipper: ShipperTC.getResolver('findOne'),
  shipperList: ShipperTC.getResolver('findMany'),

  supplier: SupplierTC.getResolver('findOne'),
  supplierConnection: SupplierTC.getResolver('connection'),
};

ViewerTC.addFields(fields);

schemaComposer.Mutation.addFields({
  // ...allowOnlyForLocalhost({
  ...autoResetDataIn30min({
    ...addQueryToPayload({
      createProduct: ProductTC.getResolver('createOne'),
      updateProduct: ProductTC.getResolver('updateById'),
      removeProduct: ProductTC.getResolver('removeOne'),

      createOrder: OrderTC.getResolver('createOne', [
        async (next, s, a, c, i) => {
          const res = await next(s, a, c, i);
          const _id = res?.record?._id;
          if (_id) pubsub.publish('ORDER_CREATED', _id);
          return res;
        },
      ]),
      updateOrder: OrderTC.getResolver('updateById', [
        async (next, s, a, c, i) => {
          const res = await next(s, a, c, i);
          const _id = res?.record?._id;
          if (_id) pubsub.publish('ORDER_UPDATED', _id);
          return res;
        },
      ]),
      removeOrder: OrderTC.getResolver('removeOne', [
        async (next, s, a, c, i) => {
          const res = await next(s, a, c, i);
          if (res?.recordId) pubsub.publish('ORDER_REMOVED', res?.recordId);
          return res;
        },
      ]),

      updateEmployee: EmployeeTC.getResolver('updateById'),
    }),
  }),
  resetData: {
    type: 'String',
    description:
      'Remove all data and seed DB from scratch. Anyway data automatically reloaded every 30 minutes.',
    resolve: async () => {
      await seedByName('northwind');
      return 'Success';
    },
  },
});

// About subscriptions you can reead here:
// - https://www.apollographql.com/docs/apollo-server/data/subscriptions/
// - https://github.com/apollographql/subscriptions-transport-ws
// - https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-core/src/ApolloServer.ts
// - https://github.com/graphql/graphql-js/blob/master/src/subscription/__tests__/subscribe-test.js
schemaComposer.Subscription.addFields({
  orderCreated: {
    type: OrderTC,
    // way 1: load Order in resolver
    resolve: (_id) => Order.findById(_id),
    subscribe: () => pubsub.asyncIterator(['ORDER_CREATED']),
  },
  orderUpdated: {
    type: OrderTC,
    // way 2: load Order in AsyncIterator
    // in same manner you may use `withFilter` helper:
    // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#subscription-filters
    resolve: (order) => order,
    subscribe: () =>
      FunctifiedAsync.map(pubsub.asyncIterator(['ORDER_UPDATED']), (_id) => {
        return Order.findById(_id);
      }),
  },
  orderRemoved: {
    type: 'MongoID',
    resolve: (_id) => _id,
    subscribe: () => pubsub.asyncIterator(['ORDER_REMOVED']),
  },
});

export default schemaComposer.buildSchema();

export { schemaComposer };
