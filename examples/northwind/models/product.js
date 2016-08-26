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
    index: true,
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

export const Product = mongoose.model('Product', ProductSchema);

export const ProductTC = composeWithRelay(composeWithMongoose(Product));

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
