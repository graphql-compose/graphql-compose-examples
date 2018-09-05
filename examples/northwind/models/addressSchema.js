/* @flow */

import mongoose from 'mongoose';

export const AddressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    region: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  {
    _id: false,
  }
);
