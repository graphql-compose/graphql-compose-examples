import fs from 'fs';
import { gql } from 'apollo-server-express';
import { buildFederatedSchema } from '@apollo/federation';
import { KeyDirective } from '@apollo/federation/dist/directives';
import { schemaComposer } from '../../examples/northwind/schema';

schemaComposer.toSDL();

// Create schema and provide KeyDirective to it
const sc = schemaComposer.clone();
sc.addDirective(KeyDirective);

const CategoryTC = sc.getOTC('Category');
const CustomerTC = sc.getOTC('Customer');
const EmployeeTC = sc.getOTC('Employee');
const OrderTC = sc.getOTC('Order');
const ProductTC = sc.getOTC('Product');
const RegionTC = sc.getOTC('Region');
const ShipperTC = sc.getOTC('Shipper');
const SupplierTC = sc.getOTC('Supplier');

// populate query
sc.Query.addFields({
  category: CategoryTC.getResolver('findOne'),
  categoryList: CategoryTC.getResolver('findMany'),

  customer: CustomerTC.getResolver('findOne'),
  customerPagination: CustomerTC.getResolver('pagination'),
  customerConnection: CustomerTC.getResolver('connection'),

  employee: EmployeeTC.getResolver('findOne'),
  // employeeList: EmployeeTC.getResolver('findMany'),
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
});

// populate mutations
// schemaComposer.Mutation.addFields({
//   createProduct: ProductTC.getResolver('createOne'),
//   updateProduct: ProductTC.getResolver('updateById'),
//   removeProduct: ProductTC.getResolver('removeOne'),

//   createOrder: OrderTC.getResolver('createOne'),
//   updateOrder: OrderTC.getResolver('updateById'),
//   removeOrder: OrderTC.getResolver('removeOne'),

//   updateEmployee: EmployeeTC.getResolver('updateById'),
// });

// add directives to entities
CategoryTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
CustomerTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
EmployeeTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
OrderTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
ProductTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
RegionTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
ShipperTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);
SupplierTC.setDirectives([{ name: 'key', args: { fields: '_id' } }]);

// implement `__resolveReference(reference)` methods in Resolvers
export const resolvers = schemaComposer.getResolveMethods();
console.log(sc.get('SortConnectionProductEnum').toSDL());
console.log(resolvers.SortConnectionProductEnum);
delete resolvers.SortConnectionProductEnum;
resolvers.Category.__resolveReference = (reference) =>
  CategoryTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Customer.__resolveReference = (reference) =>
  CustomerTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Employee.__resolveReference = (reference) =>
  EmployeeTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Order.__resolveReference = (reference) =>
  OrderTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Product.__resolveReference = (reference) =>
  ProductTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Region.__resolveReference = (reference) =>
  RegionTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Shipper.__resolveReference = (reference) =>
  ShipperTC.getResolver('findById').resolve({ args: { _id: reference._id } });
resolvers.Supplier.__resolveReference = (reference) =>
  SupplierTC.getResolver('findById').resolve({ args: { _id: reference._id } });

// prepare `typeDefs` from schema SDL
export const sdl = schemaComposer.toSDL({
  exclude: ['String', 'Boolean', 'Int', 'Float', 'ID'],
  omitDirectiveDefinitions: true,
});
fs.writeFileSync('./aaaaa.graphql', sdl);
export const typeDefs = gql(sdl);

// build federated schema
const schema = buildFederatedSchema({ typeDefs, resolvers });

export default schema;
