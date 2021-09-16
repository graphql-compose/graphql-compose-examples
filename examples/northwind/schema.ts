// SINGLE SCHEMA ON SERVER
// import { schemaComposer } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// import { SchemaComposer } from 'graphql-compose';
// const schemaComposer = new SchemaComposer();

import { PubSub } from 'graphql-subscriptions';
import { schemaComposer } from './schemaComposer';
import { categoryFindManyResolver, categoryFindOneResolver } from './models/category';
import {
  customerConnectionResolver,
  customerFindOneResolver,
  customerPaginationResolver,
} from './models/customer';
import {
  EmployeeTC,
  Employee,
  employeeFindOneResolver,
  employeeFindManyResolver,
  employeePaginationResolver,
  employeeUpdateByIdResolver,
} from './models/employee';
import {
  OrderTC,
  Order,
  orderFindOneResolver,
  orderPaginationResolver,
  orderConnectionResolver,
  orderCreateOneResolver,
  orderUpdateByIdResolver,
  orderRemoveOneResolver,
} from './models/order';
import {
  ProductTC,
  Product,
  productConnectionResolver,
  productCreateOneResolver,
  productFindManyResolver,
  productFindOneResolver,
  productPaginationResolver,
  productUpdateByIdResolver,
  productRemoveOneResolver,
} from './models/product';
import { regionFindManyResolver, regionFindOneResolver } from './models/region';
import { shipperFindManyResolver, shipperFindOneResolver } from './models/shipper';
import { supplierConnectionResolver, supplierFindOneResolver } from './models/supplier';
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
    type: ViewerTC,
    description: 'Data under client context',
    resolve: () => ({}),
  },
});

const fields = {
  category: categoryFindOneResolver,
  categoryList: categoryFindManyResolver,

  customer: customerFindOneResolver,
  customerPagination: customerPaginationResolver,
  customerConnection: customerConnectionResolver,

  employee: employeeFindOneResolver,
  employeeList: employeeFindManyResolver,
  employeePagination: employeePaginationResolver,

  order: orderFindOneResolver,
  orderPagination: orderPaginationResolver,
  orderConnection: orderConnectionResolver,

  product: productFindOneResolver,
  productList: productFindManyResolver,
  productPagination: productPaginationResolver,
  productConnection: productConnectionResolver,

  region: regionFindOneResolver,
  regionList: regionFindManyResolver,

  shipper: shipperFindOneResolver,
  shipperList: shipperFindManyResolver,

  supplier: supplierFindOneResolver,
  supplierConnection: supplierConnectionResolver,
};

ViewerTC.addFields(fields);

function emitEventMW(eventName: string) {
  return async (next, s, a, c, i) => {
    const res = await next(s, a, c, i);
    const _id = res?.record?._id;
    if (_id) pubsub.publish(eventName, _id);
    return res;
  };
}

schemaComposer.Mutation.addFields({
  // ...allowOnlyForLocalhost({
  ...autoResetDataIn30min({
    ...addQueryToPayload({
      createProduct: productCreateOneResolver.withMiddlewares([emitEventMW('PRODUCT_CREATED')]),
      updateProduct: productUpdateByIdResolver.withMiddlewares([emitEventMW('PRODUCT_UPDATED')]),
      removeProduct: productRemoveOneResolver.withMiddlewares([emitEventMW('PRODUCT_REMOVED')]),

      createOrder: orderCreateOneResolver.withMiddlewares([emitEventMW('ORDER_CREATED')]),
      updateOrder: orderUpdateByIdResolver.withMiddlewares([emitEventMW('ORDER_UPDATED')]),
      removeOrder: orderRemoveOneResolver.withMiddlewares([emitEventMW('ORDER_REMOVED')]),

      updateEmployee: employeeUpdateByIdResolver.withMiddlewares([emitEventMW('EMPLOYEE_UPDATED')]),
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
  productCreated: {
    type: ProductTC,
    resolve: (product) => product,
    subscribe: () =>
      FunctifiedAsync.map(pubsub.asyncIterator(['PRODUCT_CREATED']), (_id) => {
        return Product.findById(_id);
      }),
  },
  productUpdated: {
    type: ProductTC,
    resolve: (product) => product,
    subscribe: () =>
      FunctifiedAsync.map(pubsub.asyncIterator(['PRODUCT_UPDATED']), (_id) => {
        return Product.findById(_id);
      }),
  },
  productRemoved: {
    type: 'MongoID',
    resolve: (_id) => _id,
    subscribe: () => pubsub.asyncIterator(['PRODUCT_REMOVED']),
  },
  employeeUpdated: {
    type: EmployeeTC,
    resolve: (employee) => employee,
    subscribe: () =>
      FunctifiedAsync.map(pubsub.asyncIterator(['EMPLOYEE_UPDATED']), (_id) => {
        return Employee.findById(_id);
      }),
  },
});

export default schemaComposer.buildSchema();
