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

input CreateOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
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
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

input FilterFindOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

input FilterRemoveManyUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

input FilterRemoveOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

input FilterUpdateManyUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

input FilterUpdateOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

input FilterUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
  _id: MongoID!
}

scalar Generic

scalar MongoID

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
  userCreate(input: CreateOneUserInput!): CreateOneUserPayload
  userUpdateById(input: UpdateByIdUserInput!): UpdateByIdUserPayload
  userUpdateOne(input: UpdateOneUserInput!, filter: FilterUpdateOneUserInput, sort: SortUpdateOneUserInput, skip: Int): UpdateOneUserPayload
  userUpdateMany(input: UpdateManyUserInput!, filter: FilterUpdateManyUserInput, sort: SortUpdateManyUserInput, skip: Int, limit: Int = 1000): UpdateManyUserPayload
  userRemoveById(_id: MongoID!): RemoveByIdUserPayload
  userRemoveOne(filter: FilterRemoveOneUserInput, sort: SortRemoveOneUserInput): RemoveOneUserPayload
  userRemoveMany(filter: FilterRemoveManyUserInput!): RemoveManyUserPayload
}

type RootQuery {
  userById(_id: MongoID!): User
  userByIds(_ids: [MongoID]!, limit: Int = 1000, sort: SortFindByIdsUserInput): [User]
  userOne(filter: FilterFindOneUserInput, skip: Int, sort: SortFindOneUserInput): User
  userMany(filter: FilterFindManyUserInput, skip: Int, limit: Int = 1000, sort: SortFindManyUserInput): [User]
  userTotal(filter: FilterUserInput): Int
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
  contacts: UserContactsContactsundefined
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
  contacts: UserContactsContactsundefined
  gender: EnumUserGender
}

type UpdateManyUserPayload {
  numAffected: Int
}

input UpdateOneUserInput {
  name: String
  age: Float
  languages: Generic
  contacts: UserContactsContactsundefined
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

type UserContacts {
  email: String
  phones: [String]
}

input UserContactsContactsundefined {
  email: String
  phones: [String]
}
```
