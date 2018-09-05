/* @flow */

import mongoose from 'mongoose';
import { composeWithMongoose, composeWithRelay } from '../schemaComposer';
import { OrderTC } from './order';

export const ShipperSchema = new mongoose.Schema(
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

export const Shipper = mongoose.model('Shipper', ShipperSchema);

export const ShipperTC = composeWithRelay(composeWithMongoose(Shipper));

ShipperTC.addRelation('orderConnection', {
  resolver: () => OrderTC.getResolver('connection'),
  prepareArgs: {
    filter: source => ({ shipVia: source.shipperID }),
  },
  projection: { shipperID: true },
});
