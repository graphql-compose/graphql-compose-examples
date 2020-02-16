/* @flow */

import { Schema, model } from 'mongoose';
import { composeWithMongoose } from '../schemaComposer';
import { ProductTC } from './product';

export const CategorySchema: Schema<any> = new Schema(
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

export const Category = model('Category', CategorySchema);

export const CategoryTC = composeWithMongoose<any>(Category);

CategoryTC.addRelation('productConnection', {
  resolver: () => ProductTC.getResolver('connection'),
  prepareArgs: {
    filter: (source) => ({ categoryID: source.categoryID }),
  },
  projection: { categoryID: true },
});

CategoryTC.addRelation('productList', {
  resolver: () => ProductTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ categoryID: source.categoryID }),
  },
  projection: { categoryID: true },
});
