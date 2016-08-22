## Big GraphQL Schema Example
> This is a true story. The events depicted took place in Northwind in 1996-1998. At the request of the survivors, the names have been changed. Out of respect for the dead, the rest has been told exactly as it occurred.
> **©Fargo**

This is a sample data of some trading company, which can be managed via GraphQL.

### Models
This Schema has 8 basic types, which has many cross-relations:
- category
- customer
- employee
- order
- product
- region
- shipper
- supplier


### About DATA

Initial [SQLish schema](https://github.com/tmcnab/northwind-mongo) was modified/normalized to [MongoDBish schema](https://github.com/nodkz/graphql-compose-mongoose-example/tree/master/examples/northwind/data).
All sample data can be found in the `data` folder.


### Thanks to
- [@shayden](https://github.com/shayden) for the csv dump.
- [@tmcnab](https://github.com/tmcnab/northwind-mongo) that converted it to MongoDB.
- [@leisenstein](https://github.com/leisenstein/northwind-mongo) that clean up a CSV data.
