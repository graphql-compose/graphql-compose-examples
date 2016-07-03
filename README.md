## This is example app of `graphql-compose-mongoose`

Live example on Heroku: https://graphql-compose-mongoose.herokuapp.com/

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

<img width="1114" alt="screen shot 2016-07-03 at 15 25 41" src="https://cloud.githubusercontent.com/assets/1946920/16544735/a7e0e66c-4132-11e6-8e6a-e9ece5a7cc46.png">
