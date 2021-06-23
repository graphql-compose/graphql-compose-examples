import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { AddressSchema } from './addressSchema';
import { orderConnectionResolver, orderFindManyResolver } from './order';

export const CustomerSchema: Schema<any> = new Schema(
  {
    customerID: {
      type: String,
      description: 'Customer unique ID',
      unique: true,
    },

    companyName: {
      type: String,
      unique: true,
    },
    contactName: String,
    contactTitle: String,
    address: AddressSchema,
  },
  {
    collection: 'northwind_customers',
  }
);

export const Customer = model<any>('Customer', CustomerSchema);

export const CustomerTC = composeMongoose(Customer);

CustomerTC.addRelation('orderConnection', {
  resolver: () => orderConnectionResolver,
  prepareArgs: {
    filter: (source) => ({ customerID: source.customerID }),
  },
  projection: { customerID: true },
});

CustomerTC.addRelation('orderList', {
  resolver: () => orderFindManyResolver,
  prepareArgs: {
    filter: (source) => ({ customerID: source.customerID }),
  },
  projection: { customerID: true },
});

export const customerConnectionResolver = CustomerTC.mongooseResolvers.connection();
customerConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const customerPaginationResolver = CustomerTC.mongooseResolvers.pagination();
customerPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const customerFindManyResolver = CustomerTC.mongooseResolvers.findMany();
customerPaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.limit || 1000),
});

export const customerFindOneResolver = CustomerTC.mongooseResolvers.findOne();
