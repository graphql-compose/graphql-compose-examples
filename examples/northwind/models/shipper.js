/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose } from '../schemaComposer';
import { OrderTC } from './order';

export const ShipperSchema: Schema<any> = new Schema(
  {
    shipperID: {
      type: Number,
      description: 'Shipper unique ID',
      unique: true,
    },
    companyName: String,
    phone: String,
  },
  {
    collection: 'northwind_shippers',
  }
);

export const Shipper = model('Shipper', ShipperSchema);

export const ShipperTC = composeWithMongoose<any>(Shipper);

ShipperTC.getResolver('connection').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
};
ShipperTC.getResolver('pagination').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
};
ShipperTC.getResolver('findMany').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
};

ShipperTC.addRelation('orderConnection', {
  resolver: () => OrderTC.getResolver('connection'),
  prepareArgs: {
    filter: (source) => ({ shipVia: source.shipperID }),
  },
  projection: { shipperID: true },
});
