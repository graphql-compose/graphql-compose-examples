import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from '../schemaComposer';
import { productConnectionResolver, productFindManyResolver } from './product';

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

export const Category = model<any>('Category', CategorySchema);

export const CategoryTC = composeMongoose(Category, { schemaComposer });

CategoryTC.addRelation('productConnection', {
  resolver: () => productConnectionResolver,
  prepareArgs: {
    filter: (source) => ({ categoryID: source.categoryID }),
  },
  projection: { categoryID: true },
});

CategoryTC.addRelation('productList', {
  resolver: () => productFindManyResolver,
  prepareArgs: {
    filter: (source) => ({ categoryID: source.categoryID }),
  },
  projection: { categoryID: true },
});

export const categoryConnectionResolver = CategoryTC.mongooseResolvers.connection();
categoryConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const categoryPaginationResolver = CategoryTC.mongooseResolvers.pagination();
categoryPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const categoryFindManyResolver = CategoryTC.mongooseResolvers.findMany();
categoryFindManyResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const categoryFindOneResolver = CategoryTC.mongooseResolvers.findOne();
