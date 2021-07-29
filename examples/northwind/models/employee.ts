import { Schema, model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from '../schemaComposer';
import { AddressSchema } from './addressSchema';
import { orderConnectionResolver } from './order';

export const EmployeeSchema: Schema<any> = new Schema(
  {
    employeeID: {
      type: Number,
      description: 'Category unique ID',
      index: true,
    },
    lastName: String,
    firstName: String,
    title: String,
    titleOfCourtesy: String,
    birthDate: Date,
    hireDate: Date,
    address: AddressSchema,
    notes: String,
    reportsTo: {
      type: Number,
      description: 'ID of chief',
    },
    territoryIDs: {
      type: [Number],
      index: true,
      description: 'Attached territory ID from region collection',
    },
  },
  {
    collection: 'northwind_employees',
  }
);

EmployeeSchema.index({ lastName: 1, firstName: 1 }, { unique: true });
EmployeeSchema.index(
  {
    lastName: 'text',
    firstName: 'text',
    title: 'text',
    notes: 'text',
    'address.street': 'text',
    'address.city': 'text',
    'address.region': 'text',
    'address.postalCode': 'text',
    'address.country': 'text',
    'address.phone': 'text',
  },
  {
    name: 'EmployeesTextIndex',
    default_language: 'english',
    weights: {
      lastName: 10,
      firstName: 10,
      title: 5,
      // rest fields get weight equals to 1
    },
  }
);

export const Employee = model<any>('Employee', EmployeeSchema);

export const EmployeeTC = composeMongoose(Employee, { schemaComposer });

EmployeeTC.addRelation('chief', {
  resolver: () =>
    employeeFindOneResolver.wrapResolve((next) => (resolveParams) => {
      // if `reportsTo` is empty, then return null, otherwise proceed relation
      return resolveParams.source.reportsTo ? next(resolveParams) : null;
    }),
  prepareArgs: {
    filter: (source) => ({ employeeID: source.reportsTo }),
    skip: null,
    sort: null,
  },
  projection: { reportsTo: true },
  extensions: {
    complexity: 1,
  },
});

EmployeeTC.addRelation('subordinates', {
  resolver: () => employeeFindManyResolver,
  prepareArgs: {
    filter: (source) => ({ reportsTo: source.employeeID }),
  },
  projection: { employeeID: true },
  extensions: {
    complexity: 1,
  },
});

EmployeeTC.addRelation('orderConnection', {
  resolver: () => orderConnectionResolver,
  prepareArgs: {
    filter: (source) => ({ employeeID: source.employeeID }),
  },
  projection: { employeeID: true },
});

export const employeeConnectionResolver = EmployeeTC.mongooseResolvers.connection();
employeeConnectionResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.first || args.last || 20),
});

export const employeePaginationResolver = EmployeeTC.mongooseResolvers.pagination();
employeePaginationResolver.setExtensions({
  complexity: ({ args, childComplexity }) => childComplexity * (args.perPage || 20),
});

export const employeeFindManyResolver = EmployeeTC.mongooseResolvers.findMany().addFilterArg({
  name: 'fullTextSearch',
  type: 'String',
  description: 'Fulltext search with mongodb stemming and weights',
  query: (query, value, resolveParams) => {
    resolveParams.args.sort = {
      score: { $meta: 'textScore' },
    };
    query.$text = { $search: value, $language: 'ru' };
    resolveParams.projection.score = { $meta: 'textScore' };
  },
});
employeeFindManyResolver.setExtensions({
  complexity: ({ childComplexity }) => childComplexity * 100,
});

export const employeeFindOneResolver = EmployeeTC.mongooseResolvers.findOne();

export const employeeUpdateByIdResolver = EmployeeTC.mongooseResolvers.updateById();
