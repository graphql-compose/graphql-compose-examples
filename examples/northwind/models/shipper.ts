import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from '../schemaComposer';
import { orderConnectionResolver } from './order';

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

export const Shipper = model<any>('Shipper', ShipperSchema);

export const ShipperTC = composeMongoose(Shipper, { schemaComposer });

ShipperTC.addRelation('orderConnection', {
  resolver: () => orderConnectionResolver,
  prepareArgs: {
    filter: (source) => ({ shipVia: source.shipperID }),
  },
  projection: { shipperID: true },
});

export const shipperConnectionResolver = ShipperTC.mongooseResolvers.connection();
shipperConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const shipperPaginationResolver = ShipperTC.mongooseResolvers.pagination();
shipperPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const shipperFindManyResolver = ShipperTC.mongooseResolvers.findMany();
shipperFindManyResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const shipperFindOneResolver = ShipperTC.mongooseResolvers.findOne();
