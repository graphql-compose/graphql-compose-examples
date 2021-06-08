import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { OrderTC } from './order';
import { SupplierTC } from './supplier';
import { CategoryTC } from './category';

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

export const ProductTC = composeMongoose(Product);

ProductTC.getResolver('connection').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
};
ProductTC.getResolver('pagination').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
};
ProductTC.getResolver('findMany').extensions = {
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
};

const extendedResolver = ProductTC.getResolver('findMany').addFilterArg({
  name: 'nameRegexp',
  type: 'String',
  description: 'Search by regExp',
  query: (query, value) => {
    query.name = new RegExp(value, 'i'); // eslint-disable-line
  },
});
extendedResolver.name = 'findMany';
ProductTC.addResolver(extendedResolver);

ProductTC.addRelation('orderConnection', {
  resolver: () => OrderTC.getResolver('connection'),
  prepareArgs: {
    filter: (source) => ({ details: { productID: source.productID } }),
  },
  projection: { productID: true },
});

ProductTC.addRelation('orderList', {
  resolver: () => OrderTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ details: { productID: source.productID } }),
  },
  projection: { productID: true },
});

ProductTC.addRelation('supplier', {
  resolver: () => SupplierTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ supplierID: source.supplierID }),
    skip: null,
    sort: null,
  },
  projection: { supplierID: true },
});

ProductTC.addRelation('category', {
  resolver: () => CategoryTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ categoryID: source.categoryID }),
    skip: null,
    sort: null,
  },
  projection: { categoryID: true },
});
