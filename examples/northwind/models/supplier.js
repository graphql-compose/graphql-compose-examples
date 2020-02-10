/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose, composeWithRelay } from '../schemaComposer';
import { AddressSchema } from './addressSchema';
import { ProductTC } from './product';

export const SupplierSchema: Schema<any> = new Schema(
  {
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
  },
  {
    collection: 'northwind_suppliers',
  }
);

export const Supplier = model('Supplier', SupplierSchema);

export const SupplierTC = composeWithRelay<any>(composeWithMongoose<any>(Supplier));

SupplierTC.addRelation('productConnection', {
  resolver: () => ProductTC.getResolver('connection'),
  prepareArgs: {
    filter: (source) => ({ supplierID: source.supplierID }),
  },
  projection: { supplierID: true },
});
