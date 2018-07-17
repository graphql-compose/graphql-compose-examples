/* @flow */

import mongoose from 'mongoose';
import { composeWithMongooseDiscriminators } from 'graphql-compose-mongoose';
import { schemaComposer } from './schemaComposer';

// pick a discriminatorKey
const DKey = 'type';

const enumCharacterType = {
  PERSON: 'Person',
  DROID: 'Droid',
};

// DEFINE BASE SCHEMA
const CharacterSchema = new mongoose.Schema(
  {
    // _id: field...
    type: {
      type: String,
      require: true,
      enum: (Object.keys(enumCharacterType): Array<string>),
      description: 'Character type Droid or Person',
    },

    name: String,
    height: Number,
    mass: Number,
    films: [String],
  },
  {
    collection: 'md_characters',
  }
);

// DEFINE DISCRIMINATOR SCHEMAS
const DroidSchema = new mongoose.Schema({
  makeDate: String,
  primaryFunction: [String],
});

const PersonSchema = new mongoose.Schema({
  gender: String,
  hairColor: String,
  starships: [String],
});

// set discriminator Key
CharacterSchema.set('discriminatorKey', DKey);

// create base Model
export const CharacterModel = mongoose.model('Character', CharacterSchema);

// create mongoose discriminator models
export const DroidModel = CharacterModel.discriminator(enumCharacterType.DROID, DroidSchema);
export const PersonModel = CharacterModel.discriminator(enumCharacterType.PERSON, PersonSchema);

export const CharacterDTC = composeWithMongooseDiscriminators(CharacterModel, { schemaComposer });

export const DroidTC = CharacterDTC.discriminator(DroidModel);
export const PersonTC = CharacterDTC.discriminator(PersonModel);
