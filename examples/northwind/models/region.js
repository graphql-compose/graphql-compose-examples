/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose, composeWithRelay } from '../schemaComposer';
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

export const RegionTC = composeWithRelay<any>(composeWithMongoose<any>(Region));

RegionTC.addRelation('employees', {
  resolver: () => EmployeeTC.getResolver('findMany'),
  prepareArgs: {
    filter: source => ({
      _operators: {
        territoryIDs: {
          in: source.territories.map(t => t.territoryID) || [],
        },
      },
    }),
  },
  projection: { territories: { territoryID: true } },
});
