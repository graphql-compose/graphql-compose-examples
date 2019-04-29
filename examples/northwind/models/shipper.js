/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose, composeWithRelay } from '../schemaComposer';
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

export const ShipperTC = composeWithRelay<any>(composeWithMongoose<any>(Shipper));

ShipperTC.addRelation('orderConnection', {
  resolver: () => OrderTC.getResolver('connection'),
  prepareArgs: {
    filter: source => ({ shipVia: source.shipperID }),
  },
  projection: { shipperID: true },
});
