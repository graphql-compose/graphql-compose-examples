module.exports = {
  "env": {
    "node": true,
    "es6": true,
  },
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    "import/no-unresolved": [2, {commonjs: true, amd: true}],
    "no-underscore-dangle": 0,
    "arrow-body-style": 0,
    "import/no-extraneous-dependencies": 0,
    "import/imports-first": 0,
  }
};
