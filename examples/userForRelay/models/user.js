/* @flow */

import { model, Schema, type ObjectId } from 'mongoose';
import { composeWithMongoose, composeWithRelay } from '../schemaComposer';

const LanguagesSchema = new Schema(
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

export const UserSchema: Schema<UserDoc> = new Schema(
  {
    name: String, // standard types
    age: {
      type: Number,
      index: true,
    },
    languages: {
      type: [LanguagesSchema], // you may include other schemas (here included as array of embedded documents)
      default: [],
    },
    contacts: {
      // another mongoose way for providing embedded documents
      email: String,
      phones: [String], // array of strings
    },
    gender: {
      // enum field with values
      type: String,
      enum: ['male', 'female', 'ladyboy'],
    },
  },
  {
    collection: 'userForRelay_users',
  }
);

// Just a demo how to annotate mongoose models in Flowtype
// But better to use TypeScript & Decorators with `typegoose` package.
export class UserDoc /* :: extends Mongoose$Document */ {
  // $FlowFixMe
  _id: ObjectId;

  name: string;

  age: number;

  languages: Array<{
    language: string,
    skill: 'basic' | 'fluent' | 'native',
  }>;

  contacts: {
    email: string,
    phones: string[],
  };

  gender: 'male' | 'female' | 'ladyboy';
}

UserSchema.loadClass(UserDoc);

export const User = model('UserRelay', UserSchema);

export const UserTC = composeWithRelay(composeWithMongoose<UserDoc>(User));
