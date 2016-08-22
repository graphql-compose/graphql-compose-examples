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

ViewerTC.addField('category', CategoryTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('categoryList', CategoryTC.getResolver('findMany').getFieldConfig());

ViewerTC.addField('customer', CustomerTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('customerConnection', CustomerTC.getResolver('connection').getFieldConfig());

ViewerTC.addField('employee', EmployeeTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('employeeList', EmployeeTC.getResolver('findMany').getFieldConfig());

ViewerTC.addField('order', OrderTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('orderConnection', OrderTC.getResolver('connection').getFieldConfig());

ViewerTC.addField('product', ProductTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('productList', ProductTC.getResolver('findMany').getFieldConfig());
ViewerTC.addField('productConnection', ProductTC.getResolver('connection').getFieldConfig());

ViewerTC.addField('region', RegionTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('regionList', RegionTC.getResolver('findMany').getFieldConfig());

ViewerTC.addField('shipper', ShipperTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('shipperList', ShipperTC.getResolver('findMany').getFieldConfig());

ViewerTC.addField('supplier', SupplierTC.getResolver('findOne').getFieldConfig());
ViewerTC.addField('supplierConnection', SupplierTC.getResolver('connection').getFieldConfig());


export default GQC.buildSchema();
