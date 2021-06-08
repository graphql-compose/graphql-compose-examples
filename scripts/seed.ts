/* eslint-disable no-await-in-loop */
// This script scans `examples` folder for `data/seed.js` files and run them for seeding DB.

import { seedAll } from './seedHelpers';

seedAll().catch((e) => {
  console.log(e);
  process.exit(0);
});
