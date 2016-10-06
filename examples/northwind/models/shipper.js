import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { OrderTC } from './order';

export const ShipperSchema = new Schema({
  shipperID: {
    type: Number,
    description: 'Shipper unique ID',
    unique: true,
  },
  companyName: String,
  phone: String,
}, {
  collection: 'northwind_shippers',
});

export const Shipper = mongoose.model('Shipper', ShipperSchema);

export const ShipperTC = composeWithRelay(composeWithMongoose(Shipper));

ShipperTC.addRelation(
  'orderConnection',
  () => ({
    resolver: OrderTC.getResolver('connection'),
    args: {
      filter: (source) => ({ shipVia: source.shipperID }),
    },
    projection: { shipperID: true },
  })
);
