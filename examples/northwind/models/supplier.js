import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { AddressSchema } from './addressSchema';
import { ProductTC } from './product';

export const SupplierSchema = new Schema({
  supplierID: {
    type: Number,
    description: 'Supplier unique ID',
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
  collection: 'northwind_suppliers',
});

export const Supplier = mongoose.model('Supplier', SupplierSchema);

export const SupplierTC = composeWithRelay(composeWithMongoose(Supplier));

SupplierTC.addRelation(
  'productConnection',
  () => ({
    resolver: ProductTC.getResolver('connection'),
    args: {
      filter: (source) => ({ supplierID: source.supplierID }),
    },
    projection: { supplierID: true },
  })
);
