/* @flow */

import type { Resolver } from 'graphql-compose';
import seed from '../data/seed';

let clearDataTimeoutId;

export function autoResetDataIn30min(resolvers: { [name: string]: Resolver<any, any, any> }) {
  const secureResolvers = {};
  Object.keys(resolvers).forEach((k) => {
    secureResolvers[k] = resolvers[k].wrapResolve((next) => (rp) => {
      if (!clearDataTimeoutId) {
        clearDataTimeoutId = setTimeout(seed, 1000 * 30 * 60);
      }
      return next(rp);
    });
  });
  return secureResolvers;
}
