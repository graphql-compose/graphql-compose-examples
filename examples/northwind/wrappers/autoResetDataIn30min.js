/* @flow */

import type { Resolver } from 'graphql-compose';
import seed from '../data/seed';

let clearDataTimeoutId;

export function autoResetDataIn30min(resolvers: { [name: string]: Resolver<any, any, any> }) {
  const secureResolvers = {};
  Object.keys(resolvers).forEach((k) => {
    secureResolvers[k] = resolvers[k].wrapResolve((next) => (rp) => {
      if (!clearDataTimeoutId) {
        clearDataTimeoutId = setTimeout(() => {
          clearDataTimeoutId = null;
          seed();
        }, 60000 * 30); // in 30 minutes
      }
      return next(rp);
    });
  });
  return secureResolvers;
}
