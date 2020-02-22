/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose } from '../schemaComposer';
import { EmployeeTC } from './employee';

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

export const Region = model('Region', RegionSchema);

export const RegionTC = composeWithMongoose<any>(Region);

RegionTC.getResolver('connection').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
};
RegionTC.getResolver('pagination').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
};
RegionTC.getResolver('findMany').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
};

RegionTC.addRelation('employees', {
  resolver: () => EmployeeTC.getResolver('findMany'),
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
