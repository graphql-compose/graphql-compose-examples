/* @flow */

import mongoose, { Schema } from 'mongoose';
import { composeWithMongoose, composeWithRelay } from '../gqc';
import { ProductTC } from './product';

export const CategorySchema = new Schema(
  {
    categoryID: {
      type: Number,
      description: 'Category unique ID',
      unique: true,
    },
    name: {
      type: String,
      unique: true,
    },
    description: String,
  },
  {
    collection: 'northwind_categories',
  }
);

export const Category = mongoose.model('Category', CategorySchema);

export const CategoryTC = composeWithRelay(composeWithMongoose(Category));

CategoryTC.addRelation('productConnection', {
  resolver: () => ProductTC.getResolver('connection'),
  prepareArgs: {
    filter: source => ({ categoryID: source.categoryID }),
  },
  projection: { categoryID: true },
});

CategoryTC.addRelation('productList', {
  resolver: () => ProductTC.getResolver('findMany'),
  prepareArgs: {
    filter: source => ({ categoryID: source.categoryID }),
  },
  projection: { categoryID: true },
});
