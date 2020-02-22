/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose } from '../schemaComposer';
import { AddressSchema } from './addressSchema';
import { OrderTC } from './order';

export const CustomerSchema: Schema<any> = new Schema(
  {
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
  },
  {
    collection: 'northwind_customers',
  }
);

export const Customer = model('Customer', CustomerSchema);

export const CustomerTC = composeWithMongoose<any>(Customer);

CustomerTC.getResolver('connection').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
};
CustomerTC.getResolver('pagination').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
};
CustomerTC.getResolver('findMany').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
};

CustomerTC.addRelation('orderConnection', {
  resolver: () => OrderTC.getResolver('connection'),
  prepareArgs: {
    filter: (source) => ({ customerID: source.customerID }),
  },
  projection: { customerID: true },
});

CustomerTC.addRelation('orderList', {
  resolver: () => OrderTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ customerID: source.customerID }),
  },
  projection: { customerID: true },
});
