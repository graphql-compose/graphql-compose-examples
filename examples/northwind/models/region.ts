import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { employeeFindManyResolver } from './employee';

export const TerritorySchema: Schema<any> = new Schema(
  {
    territoryID: Number,
    name: String,
  },
  {
    _id: false,
  }
);

export const RegionSchema: Schema<any> = new Schema(
  {
    regionID: {
      type: Number,
      description: 'Region unique ID',
      unique: true,
    },
    name: String,
    territories: {
      type: [TerritorySchema],
    },
  },
  {
    collection: 'northwind_regions',
  }
);

export const Region = model<any>('Region', RegionSchema);

export const RegionTC = composeMongoose(Region);

RegionTC.addRelation('employees', {
  resolver: () => employeeFindManyResolver,
  prepareArgs: {
    filter: (source) => ({
      _operators: {
        territoryIDs: {
          in: source.territories.map((t) => t.territoryID) || [],
        },
      },
    }),
  },
  projection: { territories: { territoryID: true } },
});

export const regionConnectionResolver = RegionTC.mongooseResolvers.connection();
regionConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const regionPaginationResolver = RegionTC.mongooseResolvers.pagination();
regionPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const regionFindManyResolver = RegionTC.mongooseResolvers.findMany();
regionFindManyResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const regionFindOneResolver = RegionTC.mongooseResolvers.findOne();
