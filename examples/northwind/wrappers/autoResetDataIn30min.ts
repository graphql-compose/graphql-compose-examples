import type { Resolver } from 'graphql-compose';
import { mongoConnect, mongoDisconnect } from '../../../scripts/seedHelpers';
import seed from '../data/seed';

let clearDataTimeoutId;

export function autoResetDataIn30min(resolvers: { [name: string]: Resolver<any, any, any> }) {
  const secureResolvers = {};
  Object.keys(resolvers).forEach((k) => {
    secureResolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      if (!clearDataTimeoutId) {
        clearDataTimeoutId = setTimeout(async () => {
          clearDataTimeoutId = null;
          const db = await mongoConnect();
          await seed(db);
          await mongoDisconnect(db);
        }, 60000 * 30); // in 30 minutes
      }
      return next(rp);
    });
  });
  return secureResolvers;
}
