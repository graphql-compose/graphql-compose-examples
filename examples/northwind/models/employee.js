import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { AddressSchema } from './addressSchema';
import { OrderTC } from './order';

export const EmployeeSchema = new Schema({
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
}, {
  collection: 'northwind_employees',
});

EmployeeSchema.index({ lastName: 1, firstName: 1 }, { unique: true });

export const Employee = mongoose.model('Employee', EmployeeSchema);

export const EmployeeTC = composeWithRelay(composeWithMongoose(Employee));

EmployeeTC.addRelation(
  'chief',
  () => ({
    resolver: EmployeeTC.getResolver('findOne')
                .wrapResolve(next => resolveParams => {
                  // if `reportsTo` is empty, then return null, otherwise proceed relation
                  return resolveParams.source.reportsTo ? next(resolveParams) : null;
                }),
    args: {
      filter: (source) => ({ employeeID: source.reportsTo }),
      skip: null,
      sort: null,
    },
    projection: { reportsTo: true },
  })
);

EmployeeTC.addRelation(
  'subordinates',
  () => ({
    resolver: EmployeeTC.getResolver('findMany'),
    args: {
      filter: (source) => ({ reportsTo: source.employeeID }),
    },
    projection: { employeeID: true },
  })
);

EmployeeTC.addRelation(
  'orderConnection',
  () => ({
    resolver: OrderTC.getResolver('connection'),
    args: {
      filter: (source) => ({ employeeID: source.employeeID }),
    },
    projection: { employeeID: true },
  })
);
