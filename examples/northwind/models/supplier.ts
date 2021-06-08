import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
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

export const Supplier = model<any>('Supplier', SupplierSchema);

export const SupplierTC = composeMongoose(Supplier);

SupplierTC.getResolver('connection').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
};
SupplierTC.getResolver('pagination').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
};
SupplierTC.getResolver('findMany').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
};

SupplierTC.addRelation('productConnection', {
  resolver: () => ProductTC.getResolver('connection'),
  prepareArgs: {
    filter: (source) => ({ supplierID: source.supplierID }),
  },
  projection: { supplierID: true },
});
