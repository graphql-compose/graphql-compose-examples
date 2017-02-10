import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { OrderTC } from './order';
import { SupplierTC } from './supplier';
import { CategoryTC } from './category';

export const ProductSchema = new Schema({
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
}, {
  collection: 'northwind_products',
});

ProductSchema.index({ name: 1, supplierID: 1 }, { unique: true });

export const Product = mongoose.model('Product', ProductSchema);

export const ProductTC = composeWithRelay(composeWithMongoose(Product));

const extendedResolver = ProductTC
  .getResolver('findMany')
  .addFilterArg({
    name: 'nameRegexp',
    type: 'String',
    description: 'Search by regExp',
    query: (query, value, resolveParams) => { // eslint-disable-line
      query.name = new RegExp(value, 'i'); // eslint-disable-line
    },
  });
extendedResolver.name = 'findMany';
ProductTC.addResolver(extendedResolver);


ProductTC.addRelation(
  'orderConnection',
  () => ({
    resolver: OrderTC.getResolver('connection'),
    args: {
      filter: (source) => ({ details: { productID: source.productID } }),
    },
    projection: { productID: true },
  })
);

ProductTC.addRelation(
  'supplier',
  () => ({
    resolver: SupplierTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ supplierID: source.supplierID }),
      skip: null,
      sort: null,
    },
    projection: { supplierID: true },
  })
);

ProductTC.addRelation(
  'category',
  () => ({
    resolver: CategoryTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ categoryID: source.categoryID }),
      skip: null,
      sort: null,
    },
    projection: { categoryID: true },
  })
);
