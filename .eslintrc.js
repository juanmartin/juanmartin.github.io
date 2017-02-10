module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "es6": true,
        "browser": true
    },
    "rules": {
        "no-trailing-spaces": "error",
        "semi": "error",
        "indent": ["error", 4],
        "comma-dangle": ["error", "never"],
        "no-console": 0
    },
    "globals": {
        "THREE": true,
        "Stats": true
    }
};
