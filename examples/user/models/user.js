import mongoose from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import {InputTypeComposer} from 'graphql-compose';


const LanguagesSchema = new mongoose.Schema(
  {
    language: String,
    skill: {
      type: String,
      enum: ['basic', 'fluent', 'native'],
    },
  },
  {
    _id: false, // disable `_id` field for `Language` schema
  }
);

const AddressSchema = new mongoose.Schema(
  {
    street: String,
  geo:{
      type: [Number],  // [<longitude>, <latitude>]
      index: '2d'      // create the geospatial index
      }
  }
);

export const UserSchema = new mongoose.Schema({
  name: String, // standard types
  age: {
    type: Number,
    index: true,
  },
  languages: {
    type: [LanguagesSchema], // you may include other schemas (also as array of embedded documents)
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
  address:{
    type:[AddressSchema],
    default:[]
  },
  someMixed: {
    type: mongoose.Schema.Types.Mixed,
    description: 'Some dynamic data',
  },
}, {
  collection: 'user_users',
});

export const User = mongoose.model('User', UserSchema);

export const UserTC = composeWithMongoose(User);


// create complex input type for geo point
 InputTypeComposer.create(`input LonLat {
   lng: Float!
   lat: Float!
 }`);

 export const UserListResolver = UserTC.getResolver('findMany')
 .addFilterArg({
     name: 'geo',
     type: 'LonLat',
     description: 'Search by 5km radius (`2dsphere` index on `geo` field)',
     query: (rawQuery, value, resolveParams) => {
       if (value.lng || value.lat) {
         rawQuery.address = {
                   geo:{
                     $nearSphere: {
                        $geometry: {
                           type: "Point",
                           coordinates: [ value.lng, value.lat ]
                        },
                        $maxDistance: 5000
                  }
               }
             };
         }
     },
   })
   // /* FOR DEBUG */
   // .wrapResolve((next) => (rp) => {
   //   const res = next(rp);
   //   console.log(rp);
   //   return res;
   // })
   .getFieldConfig();
