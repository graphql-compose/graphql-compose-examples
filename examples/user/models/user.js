import mongoose from 'mongoose';
import mongooseToTypeComposer from 'graphql-compose-mongoose';


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

export const UserRelaySchema = new mongoose.Schema({
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
  someMixed: {
    type: mongoose.Schema.Types.Mixed,
    description: 'Some dynamic data',
  },
}, {
  collection: 'user_users',
});

export const UserModel = mongoose.model('UserRelay', UserRelaySchema);

const customizationOptions = {}; // left it empty for simplicity
export const UserTC = mongooseToTypeComposer(UserModel, customizationOptions);
