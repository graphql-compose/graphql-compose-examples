import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { AddressSchema } from './addressSchema';
import { CustomerTC } from './cutomer';
import { EmployeeTC } from './employee';
import { ShipperTC } from './shipper';
import { ProductTC } from './product';

export const OrderDetailsSchema = new Schema(
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

export const OrderSchema = new Schema({
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
    index: true,
    description: 'List of ordered products',
  },
}, {
  collection: 'northwind_orders',
});

export const Order = mongoose.model('Order', OrderSchema);

export const OrderTC = composeWithRelay(composeWithMongoose(Order));

OrderTC.addRelation(
  'customer',
  () => ({
    resolver: CustomerTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ customerID: source.customerID }),
      skip: null,
      sort: null,
    },
    projection: { customerID: true },
  })
);

OrderTC.addRelation(
  'employee',
  () => ({
    resolver: EmployeeTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ employeeID: source.employeeID }),
      skip: null,
      sort: null,
    },
    projection: { employeeID: true },
  })
);

OrderTC.addRelation(
  'shipper',
  () => ({
    resolver: ShipperTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ shipperID: source.shipVia }),
      skip: null,
      sort: null,
    },
    projection: { shipVia: true },
  })
);

const OrderDetailsTC = OrderTC.get('details');
OrderDetailsTC.addRelation(
  'product',
  () => ({
    resolver: ProductTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ productID: source.productID }),
      skip: null,
      sort: null,
    },
    projection: { productID: true },
  })
);
