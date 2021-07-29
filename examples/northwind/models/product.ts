import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from '../schemaComposer';
import { orderConnectionResolver, orderFindManyResolver } from './order';
import { supplierFindOneResolver } from './supplier';
import { categoryFindOneResolver } from './category';

export const ProductSchema: Schema<any> = new Schema(
  {
    productID: {
      type: Number,
      description: 'Unique product id',
      unique: true,
    },
    name: String,
    supplierID: Number,
    categoryID: Number,
    quantityPerUnit: String,
    unitPrice: {
      type: Number,
      index: true,
    },
    unitsInStock: Number,
    unitsOnOrder: Number,
    reorderLevel: Number,
    discontinued: Boolean,
  },
  {
    collection: 'northwind_products',
  }
);

ProductSchema.index({ name: 1, supplierID: 1 }, { unique: true });

export const Product = model<any>('Product', ProductSchema);

export const ProductTC = composeMongoose(Product, { schemaComposer });

ProductTC.addRelation('orderConnection', {
  resolver: () => orderConnectionResolver,
  prepareArgs: {
    filter: (source) => ({ details: { productID: source.productID } }),
  },
  projection: { productID: true },
});

ProductTC.addRelation('orderList', {
  resolver: () => orderFindManyResolver,
  prepareArgs: {
    filter: (source) => ({ details: { productID: source.productID } }),
  },
  projection: { productID: true },
});

ProductTC.addRelation('supplier', {
  resolver: () => supplierFindOneResolver,
  prepareArgs: {
    filter: (source) => ({ supplierID: source.supplierID }),
    skip: null,
    sort: null,
  },
  projection: { supplierID: true },
});

ProductTC.addRelation('category', {
  resolver: () => categoryFindOneResolver,
  prepareArgs: {
    filter: (source) => ({ categoryID: source.categoryID }),
    skip: null,
    sort: null,
  },
  projection: { categoryID: true },
});

export const productConnectionResolver = ProductTC.mongooseResolvers.connection();
productConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const productPaginationResolver = ProductTC.mongooseResolvers.pagination();
productPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const productFindManyResolver = ProductTC.mongooseResolvers.findMany().addFilterArg({
  name: 'nameRegexp',
  type: 'String',
  description: 'Search by regExp',
  query: (query, value) => {
    query.name = new RegExp(value, 'i');
  },
});
productFindManyResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const productFindOneResolver = ProductTC.mongooseResolvers.findOne();

export const productCreateOneResolver = ProductTC.mongooseResolvers.createOne();
export const productUpdateByIdResolver = ProductTC.mongooseResolvers.updateById();
export const productRemoveOneResolver = ProductTC.mongooseResolvers.removeOne();
