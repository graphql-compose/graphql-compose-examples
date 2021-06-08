import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
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

export const Category = model<any>('Category', CategorySchema);

export const CategoryTC = composeMongoose(Category);

// TODO refactor
CategoryTC.getResolver('connection').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
};
CategoryTC.getResolver('pagination').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
};
CategoryTC.getResolver('findMany').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
};

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
