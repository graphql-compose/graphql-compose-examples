## This is example app of `graphql-compose-mongoose`

Live example on Heroku: [https://graphql-compose-mongoose.herokuapp.com/](https://graphql-compose-mongoose.herokuapp.com/?query=%7B%0A%20%20userMany(limit%3A%205)%20%7B%0A%20%20%20%20_id%0A%20%20%20%20name%0A%20%20%20%20age%0A%20%20%7D%0A%7D)

```
npm install
npm start
open http://localhost:3000
```

This example has simple User mongoose model that supports bunch of CRUD operations.

```js
const UserSchema = new mongoose.Schema({
  name: String, // standard types
  age: {
    type: Number,
    index: true,
  },
  languages: {
    type: [LanguagesSchema], // you may include other schemas (here included as array of embedded documents)
    default: [],
  },
  contacts: { // another mongoose way for providing embedded documents
    email: String,
    phones: [String], // array of strings
  },
  gender: { // enum field with values
    type: String,
    enum: ['male', 'female', 'ladyboy'],
  },
});
```

<img width="982" alt="screen shot 2016-07-03 at 15 23 03" src="https://cloud.githubusercontent.com/assets/1946920/16544733/9ef9b146-4132-11e6-8a90-8702d2474cfd.png">

<img width="1330" alt="screen shot 2016-07-15 at 12 41 17" src="https://cloud.githubusercontent.com/assets/1946920/16865833/7ec028c8-4a89-11e6-980e-e17745e5085c.png">

### Generated schema in txt format
```
schema {
  query: RootQuery
  mutation: RootMutation
}

input _idOperatorsFilterFindManyUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input _idOperatorsFilterFindOneUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input _idOperatorsFilterRemoveManyUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input _idOperatorsFilterRemoveOneUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input _idOperatorsFilterUpdateManyUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input _idOperatorsFilterUpdateOneUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input _idOperatorsFilterUserInput {
  gt: MongoID
  gte: MongoID
  lt: MongoID
  lte: MongoID
  ne: MongoID
  in: [MongoID]
  nin: [MongoID]
}

input AgeOperatorsFilterFindManyUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

input AgeOperatorsFilterFindOneUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

input AgeOperatorsFilterRemoveManyUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

input AgeOperatorsFilterRemoveOneUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

input AgeOperatorsFilterUpdateManyUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

input AgeOperatorsFilterUpdateOneUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

input AgeOperatorsFilterUserInput {
  gt: Float
  gte: Float
  lt: Float
  lte: Float
  ne: Float
  in: [Float]
  nin: [Float]
}

scalar ConnectionCursor

input CreateOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
}

type CreateOneUserPayload {
  recordId: MongoID
  record: User
}

enum EnumUserGender {
  male
  female
  ladyboy
}

input FilterFindManyUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterFindManyUserInput
}

input FilterFindOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterFindOneUserInput
}

input FilterRemoveManyUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterRemoveManyUserInput
}

input FilterRemoveOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterRemoveOneUserInput
}

input FilterUpdateManyUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterUpdateManyUserInput
}

input FilterUpdateOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterUpdateOneUserInput
}

input FilterUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID
  _operators: OperatorsFilterUserInput
}

scalar Generic

scalar MongoID

input OperatorsFilterFindManyUserInput {
  age: AgeOperatorsFilterFindManyUserInput
  _id: _idOperatorsFilterFindManyUserInput
}

input OperatorsFilterFindOneUserInput {
  age: AgeOperatorsFilterFindOneUserInput
  _id: _idOperatorsFilterFindOneUserInput
}

input OperatorsFilterRemoveManyUserInput {
  age: AgeOperatorsFilterRemoveManyUserInput
  _id: _idOperatorsFilterRemoveManyUserInput
}

input OperatorsFilterRemoveOneUserInput {
  age: AgeOperatorsFilterRemoveOneUserInput
  _id: _idOperatorsFilterRemoveOneUserInput
}

input OperatorsFilterUpdateManyUserInput {
  age: AgeOperatorsFilterUpdateManyUserInput
  _id: _idOperatorsFilterUpdateManyUserInput
}

input OperatorsFilterUpdateOneUserInput {
  age: AgeOperatorsFilterUpdateOneUserInput
  _id: _idOperatorsFilterUpdateOneUserInput
}

input OperatorsFilterUserInput {
  age: AgeOperatorsFilterUserInput
  _id: _idOperatorsFilterUserInput
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type RemoveByIdUserPayload {
  recordId: MongoID
  record: User
}

type RemoveManyUserPayload {
  numAffected: Int
}

type RemoveOneUserPayload {
  recordId: MongoID
  record: User
}

type RootMutation {
  userCreate(record: CreateOneUserInput!): CreateOneUserPayload
  userUpdateById(record: UpdateByIdUserInput!): UpdateByIdUserPayload
  userUpdateOne(record: UpdateOneUserInput!, filter: FilterUpdateOneUserInput, sort: SortUpdateOneUserInput, skip: Int): UpdateOneUserPayload
  userUpdateMany(record: UpdateManyUserInput!, filter: FilterUpdateManyUserInput, sort: SortUpdateManyUserInput, skip: Int, limit: Int = 1000): UpdateManyUserPayload
  userRemoveById(_id: MongoID!): RemoveByIdUserPayload
  userRemoveOne(filter: FilterRemoveOneUserInput, sort: SortRemoveOneUserInput): RemoveOneUserPayload
  userRemoveMany(filter: FilterRemoveManyUserInput!): RemoveManyUserPayload
}

type RootQuery {
  userById(_id: MongoID!): User
  userByIds(_ids: [MongoID]!, limit: Int = 1000, sort: SortFindByIdsUserInput): [User]
  userOne(filter: FilterFindOneUserInput, skip: Int, sort: SortFindOneUserInput): User
  userMany(filter: FilterFindManyUserInput, skip: Int, limit: Int = 1000, sort: SortFindManyUserInput): [User]
  userCount(filter: FilterUserInput): Int
  userConnection(first: Int, after: ConnectionCursor, last: Int, before: ConnectionCursor, filter: FilterFindManyUserInput, sort: SortConnectionUserEnum = _ID_DESC): UserConnection
}

enum SortConnectionUserEnum {
  _ID_DESC
  _ID_ASC
}

enum SortFindByIdsUserInput {
  _ID_ASC
  _ID_DESC
  AGE_ASC
  AGE_DESC
}

enum SortFindManyUserInput {
  _ID_ASC
  _ID_DESC
  AGE_ASC
  AGE_DESC
}

enum SortFindOneUserInput {
  _ID_ASC
  _ID_DESC
  AGE_ASC
  AGE_DESC
}

enum SortRemoveOneUserInput {
  _ID_ASC
  _ID_DESC
  AGE_ASC
  AGE_DESC
}

enum SortUpdateManyUserInput {
  _ID_ASC
  _ID_DESC
  AGE_ASC
  AGE_DESC
}

enum SortUpdateOneUserInput {
  _ID_ASC
  _ID_DESC
  AGE_ASC
  AGE_DESC
}

input UpdateByIdUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
  _id: MongoID!
}

type UpdateByIdUserPayload {
  recordId: MongoID
  record: User
}

input UpdateManyUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
}

type UpdateManyUserPayload {
  numAffected: Int
}

input UpdateOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContacts
  gender: EnumUserGender
}

type UpdateOneUserPayload {
  recordId: MongoID
  record: User
}

type User {
  name: String
  age: Float
  languages: Generic
  contacts: UserContacts
  gender: EnumUserGender
  _id: MongoID
}

type UserConnection {
  count: Int
  pageInfo: PageInfo!
  edges: [UserEdge]
}

type UserContacts {
  email: String
  phones: [String]
}

input UserContactsContacts {
  email: String
  phones: [String]
}

type UserEdge {
  node: User
  cursor: ConnectionCursor!
}
```
