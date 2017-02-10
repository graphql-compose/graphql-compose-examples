export default function allowOnlyForLocalhost(resolvers) {
  const secureResolvers = {};
  Object.keys(resolvers).forEach((k) => {
    secureResolvers[k] = resolvers[k].wrapResolve(next => (rp) => {
      if (rp.context.ip === '127.0.0.1' || rp.context.ip === '0:0:0:0:0:0:0:1' || __DEV__ === true) {
        return next(rp);
      }
      throw new Error('For security reason mutation are disabled on Heroku, but will work on your localhost. Please clone https://github.com/nodkz/graphql-compose-examples repo and start server locally.');
    });
  });
  return secureResolvers;
}