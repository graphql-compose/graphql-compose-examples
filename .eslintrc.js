module.exports = {
  "env": {
    "node": true,
    "es6": true,
    "jest": true,
  },
  "extends": [
    "airbnb-base",
    "prettier"
  ],
  "plugins": [
    "prettier"
  ],
  "env": {
    "jasmine": true,
    "jest": true
  },
  "parser": "babel-eslint",
  "rules": {
    "import/no-unresolved": [2, {commonjs: true, amd: true}],
    "no-underscore-dangle": 0,
    "arrow-body-style": 0,
    "import/no-extraneous-dependencies": 0,
    "import/imports-first": 0,
    "no-console": 0,
    "no-restricted-syntax": 0,
    "global-require": 0,
    "import/no-dynamic-require": 0,
    "import/prefer-default-export": 0,
    "no-use-before-define": 0,
    "no-param-reassign": 0,
    "func-names": 0,
    "prettier/prettier": ["error", {
      "printWidth": 100,
      "singleQuote": true,
      "trailingComma": "es5",
    }]
  }
};
