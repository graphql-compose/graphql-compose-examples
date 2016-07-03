## This is example app of `graphql-compose-mongoose`

It is available on Heroku: https://graphql-compose-mongoose.herokuapp.com/

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
