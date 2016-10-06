import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { EmployeeTC } from './employee';

export const TerritorySchema = Schema({
  territoryID: Number,
  name: String,
}, {
  _id: false,
});

export const RegionSchema = new Schema({
  regionID: {
    type: Number,
    description: 'Region unique ID',
    unique: true,
  },
  name: String,
  territories: {
    type: [TerritorySchema],
  },
}, {
  collection: 'northwind_regions',
});

export const Region = mongoose.model('Region', RegionSchema);

export const RegionTC = composeWithRelay(composeWithMongoose(Region));

RegionTC.addRelation(
  'employees',
  () => ({
    resolver: EmployeeTC.getResolver('findMany'),
    args: {
      filter: (source) => ({
        _operators: {
          territoryIDs: {
            in: source.territories.map(t => t.territoryID) || [],
          },
        },
      }),
    },
    projection: { territories: { territoryID: true } },
  })
);
