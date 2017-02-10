// SINGLE SCHEMA ON SERVER
// import { GQC } from 'graphql-compose';

// MULTI SCHEMA MODE IN ONE SERVER
// create new GQC from ComposeStorage
import { ComposeStorage } from 'graphql-compose';
const GQC = new ComposeStorage();


import composeWithRelay from 'graphql-compose-relay';

import { CategoryTC } from './models/category';
import { CustomerTC } from './models/cutomer';
import { EmployeeTC } from './models/employee';
import { OrderTC } from './models/order';
import { ProductTC } from './models/product';
import { RegionTC } from './models/region';
import { ShipperTC } from './models/shipper';
import { SupplierTC } from './models/supplier';
import allowOnlyForLocalhost from './auth/allowOnlyForLocalhost';

composeWithRelay(GQC.rootQuery());

const ViewerTC = GQC.get('Viewer');
GQC.rootQuery().addFields({
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
  customerConnection: CustomerTC.getResolver('connection'),

  employee: EmployeeTC.getResolver('findOne'),
  employeeList: EmployeeTC.getResolver('findMany'),

  order: OrderTC.getResolver('findOne'),
  orderConnection: OrderTC.getResolver('connection'),

  product: ProductTC.getResolver('findOne'),
  productList: ProductTC.getResolver('findMany'),
  productConnection: ProductTC.getResolver('connection'),

  region: RegionTC.getResolver('findOne'),
  regionList: RegionTC.getResolver('findMany'),

  shipper: ShipperTC.getResolver('findOne'),
  shipperList: ShipperTC.getResolver('findMany'),

  supplier: SupplierTC.getResolver('findOne'),
  supplierConnection: SupplierTC.getResolver('connection'),
};

ViewerTC.addFields(fields);

GQC.rootMutation().addFields({
  ...allowOnlyForLocalhost({
    createProduct: ProductTC.get('$createOne'),
    removeProductById: ProductTC.get('$removeById'),
  })
});

export default GQC.buildSchema();
