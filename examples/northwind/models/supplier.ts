import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { AddressSchema } from './addressSchema';
import { productConnectionResolver } from './product';

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

SupplierTC.addRelation('productConnection', {
  resolver: () => productConnectionResolver,
  prepareArgs: {
    filter: (source) => ({ supplierID: source.supplierID }),
  },
  projection: { supplierID: true },
});

export const supplierConnectionResolver = SupplierTC.mongooseResolvers.connection();
supplierConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const supplierPaginationResolver = SupplierTC.mongooseResolvers.pagination();
supplierPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const supplierFindManyResolver = SupplierTC.mongooseResolvers.findMany();
supplierFindManyResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const supplierFindOneResolver = SupplierTC.mongooseResolvers.findOne();
