import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { AddressSchema } from './addressSchema';
import { customerFindOneResolver } from './customer';
import { employeeFindOneResolver } from './employee';
import { shipperFindOneResolver } from './shipper';
import { productFindOneResolver } from './product';

export const OrderDetailsSchema: Schema<any> = new Schema(
  {
    productID: Number,
    unitPrice: Number,
    quantity: Number,
    discount: Number,
  },
  {
    _id: false,
  }
);

export const OrderSchema: Schema<any> = new Schema(
  {
    orderID: {
      type: Number,
      description: 'Order unique ID',
      unique: true,
    },
    customerID: String,
    employeeID: Number,
    orderDate: Date,
    requiredDate: Date,
    shippedDate: Date,
    shipVia: Number,
    freight: Number,
    shipName: String,
    shipAddress: AddressSchema,
    details: {
      type: [OrderDetailsSchema],
      description: 'List of ordered products',
    },
  },
  {
    collection: 'northwind_orders',
  }
);

export const Order = model<any>('Order', OrderSchema);

export const OrderTC = composeMongoose(Order);

OrderTC.addRelation('customer', {
  resolver: () => customerFindOneResolver,
  prepareArgs: {
    filter: (source) => ({ customerID: source.customerID }),
    skip: null,
    sort: null,
  },
  projection: { customerID: true },
});

OrderTC.addRelation('employee', {
  resolver: () => employeeFindOneResolver,
  prepareArgs: {
    filter: (source) => ({ employeeID: source.employeeID }),
    skip: null,
    sort: null,
  },
  projection: { employeeID: true },
});

OrderTC.addRelation('shipper', {
  resolver: () => shipperFindOneResolver,
  prepareArgs: {
    filter: (source) => ({ shipperID: source.shipVia }),
    skip: null,
    sort: null,
  },
  projection: { shipVia: true },
});

const OrderDetailsTC = OrderTC.getFieldOTC('details');
OrderDetailsTC.addRelation('product', {
  resolver: () => productFindOneResolver,
  prepareArgs: {
    filter: (source) => ({ productID: source.productID }),
    skip: null,
    sort: null,
  },
  projection: { productID: true },
});

export const orderConnectionResolver = OrderTC.mongooseResolvers.connection();
orderConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const orderPaginationResolver = OrderTC.mongooseResolvers.pagination();
orderPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const orderFindManyResolver = OrderTC.mongooseResolvers.findMany();
orderFindManyResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const orderFindOneResolver = OrderTC.mongooseResolvers.findOne();

export const orderCreateOneResolver = OrderTC.mongooseResolvers.createOne();
export const orderUpdateByIdResolver = OrderTC.mongooseResolvers.updateById();
export const orderRemoveOneResolver = OrderTC.mongooseResolvers.removeOne();
