import { GQC } from 'graphql-compose';
import composeWithRelay from 'graphql-compose-relay';

import { CategoryTC } from './models/category';
import { CustomerTC } from './models/cutomer';
import { EmployeeTC } from './models/employee';
import { OrderTC } from './models/order';
import { ProductTC } from './models/product';
import { RegionTC } from './models/region';
import { ShipperTC } from './models/shipper';
import { SupplierTC } from './models/supplier';

composeWithRelay(GQC.rootQuery());

const ViewerTC = GQC.get('Viewer');
GQC.rootQuery().addField('viewer', {
  type: ViewerTC.getType(),
  description: 'Data under client context',
  resolve: () => ({}),
});

const fields = {
  category: CategoryTC.getResolver('findOne').getFieldConfig(),
  categoryList: CategoryTC.getResolver('findMany').getFieldConfig(),

  customer: CustomerTC.getResolver('findOne').getFieldConfig(),
  customerConnection: CustomerTC.getResolver('connection').getFieldConfig(),

  employee: EmployeeTC.getResolver('findOne').getFieldConfig(),
  employeeList: EmployeeTC.getResolver('findMany').getFieldConfig(),

  order: OrderTC.getResolver('findOne').getFieldConfig(),
  orderConnection: OrderTC.getResolver('connection').getFieldConfig(),

  product: ProductTC.getResolver('findOne').getFieldConfig(),
  productList: ProductTC.getResolver('findMany').getFieldConfig(),
  productConnection: ProductTC.getResolver('connection').getFieldConfig(),

  region: RegionTC.getResolver('findOne').getFieldConfig(),
  regionList: RegionTC.getResolver('findMany').getFieldConfig(),

  shipper: ShipperTC.getResolver('findOne').getFieldConfig(),
  shipperList: ShipperTC.getResolver('findMany').getFieldConfig(),

  supplier: SupplierTC.getResolver('findOne').getFieldConfig(),
  supplierConnection: SupplierTC.getResolver('connection').getFieldConfig(),
};

ViewerTC.addFields(fields);

export default GQC.buildSchema();
