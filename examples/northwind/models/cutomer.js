import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { AddressSchema } from './addressSchema';
import { OrderTC } from './order';

export const CustomerSchema = new Schema({
  customerID: {
    type: String,
    description: 'Customer unique ID',
    unique: true,
  },

  companyName: {
    type: String,
    unique: true,
  },
  contactName: String,
  contactTitle: String,
  address: AddressSchema,
}, {
  collection: 'northwind_customers',
});

export const Customer = mongoose.model('Customer', CustomerSchema);

export const CustomerTC = composeWithRelay(composeWithMongoose(Customer));

CustomerTC.addRelation(
  'orderConnection',
  () => ({
    resolver: OrderTC.getResolver('connection'),
    args: {
      filter: (source) => ({ customerID: source.customerID }),
    },
    projection: { customerID: true },
  })
);
