module.exports = {
  "extends": "airbnb-base",
  "plugins": ["import"],
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
    "jquery": true
  },
  "rules": {
    "comma-dangle": [
      "error", "never"
    ],
    quotes: [
      "error", "double"
    ],
    "object-curly-spacing": ["error", "never"]
  }
};
