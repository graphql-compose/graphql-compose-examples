## Northwind source and transformed data
> This is a true story. The events depicted took place in Northwind in 1996-1998. At the request of the survivors, the names have been changed. Out of respect for the dead, the rest has been told exactly as it occurred.
> **©Fargo**

This is a sample data of some trading company:
- Initial SQLish schema can be found in [csv folder](https://github.com/nodkz/graphql-compose-mongoose-example/tree/master/examples/northwind/data/csv).
- Modified/normalized MongoDBish schema in [json folder](https://github.com/nodkz/graphql-compose-mongoose-example/tree/master/examples/northwind/data/json).

Run `./mongo-import.sh` for load data from `csv` folder to your local mongodb, and export transformed collections to `json` folder.

File `mongo-shell-transform.js` is a `mongo shell` script, that makes data transformation (rename/remove/embed fields). Called internally in `./mongo-import.sh`.

### How schema was transformed
- **categories** (8 docs)
  - categoryID: int
  - categoryName->name: string
  - description: string
  - picture->REMOVED: bin
- **customers** (91 docs)
  - customerID: string
  - companyName: string
  - contactName: string
  - contactTitle: string
  - address: EMBEDDED
    - address->street: string
    - city: string
    - region: string
    - postalCode: string
    - country: string
    - phone: string
    - fax->REMOVED: string
- **employees** (9 docs)
  - employeeID: int
  - lastName: string
  - firstName: string
  - title: string
  - titleOfCourtesy: string
  - birthDate: datetime
  - hireDate: datetime
  - address: EMBEDDED
    - address->street: string
    - city: string
    - region: string
    - postalCode: string
    - country: string
    - homePhone->phone: string
    - extension->REMOVED: string
  - photo->REMOVED: bin
  - notes: string
  - reportsTo: int<EmployeeID>
  - photoPath->REMOVED: string
  - territoryIDs: ARRAY from **employee-territories** (49 subdocs in total)
    - employeeID: int
    - territoryID: int
- **orders** (830 docs)
  - orderID: int
  - customerID: string
  - employeeID: int
  - orderDate: datetime
  - requiredDate: datetime
  - shippedDate: datetime
  - shipVia: int<Shippers>
  - freight: float
  - shipName: string
  - shipAddress: EMBEDDED
    - shipAddress->street: string
    - shipCity->city: string
    - shipRegion->region: string
    - shipPostalCode->postalCode: string
    - shipCountry->country: string
  - details: EMBEDDED ARRAY of **order-details** (2155 subdocs in total)
    - orderID->REMOVED: int
    - productID: int
    - unitPrice: float
    - quantity: int
    - discount: float
- **products** (77 docs)
  - productID: int
  - productName: string
  - supplierID: int
  - categoryID: int
  - quantityPerUnit: string
  - unitPrice: float
  - unitsInStock: int
  - unitsOnOrder: int
  - reorderLevel: int
  - discontinued: boolean
- **regions** (4 docs)
  - regionID: int
  - regionDescription->name: string
  - territories: EMBEDDED ARRAY of **territories** (53 subdocs in total)
    - territoryID: int
    - territoryDescription->name: string
    - regionID: int
- **shippers** (3 docs)
  - shipperID: int
  - companyName: string
  - phone: string
- **suppliers** (29 docs)
  - supplierID: int
  - companyName: string
  - contactName: string
  - contactTitle: string
  - address:EMBEDDED
    - address->street: string
    - city: string
    - region: string
    - postalCode: string
    - country: string
    - phone: string
    - fax->REMOVED: string
  - homePage->REMOVED: string


### Thanks to
- [@shayden](https://github.com/shayden) for the csv dump.
- [@tmcnab](https://github.com/tmcnab/northwind-mongo) that converted it to MongoDB.
- [@leisenstein](https://github.com/leisenstein/northwind-mongo) that clean up a CSV data.
