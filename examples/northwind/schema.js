/* @flow */

// SINGLE SCHEMA ON SERVER
// import { schemaComposer } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// import { SchemaComposer } from 'graphql-compose';
// const schemaComposer = new SchemaComposer();

import { schemaComposer, composeWithRelay } from './schemaComposer';
import { CategoryTC } from './models/category';
import { CustomerTC } from './models/customer';
import { EmployeeTC } from './models/employee';
import { OrderTC } from './models/order';
import { ProductTC } from './models/product';
import { RegionTC } from './models/region';
import { ShipperTC } from './models/shipper';
import { SupplierTC } from './models/supplier';
// import { allowOnlyForLocalhost } from './wrappers/allowOnlyForLocalhost';
import { addQueryToPayload } from './wrappers/addQueryToPayload';
import { autoResetDataIn30min } from './wrappers/autoResetDataIn30min';
import seed from './data/seed';

composeWithRelay(schemaComposer.Query);

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
      removeProduct: ProductTC.getResolver('removeById'),

      createOrder: OrderTC.getResolver('createOne'),
      updateOrder: OrderTC.getResolver('updateById'),
      removeOrder: OrderTC.getResolver('removeById'),

      updateEmployee: EmployeeTC.getResolver('updateById'),
    }),
  }),
  resetData: {
    type: 'String',
    description:
      'Remove all data and seed DB from scratch. Anyway data automatically reloaded every 30 minutes.',
    resolve: async () => {
      await seed();
      return 'Success';
    },
  },
});

export default schemaComposer.buildSchema();
