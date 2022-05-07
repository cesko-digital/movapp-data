module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: "tsconfig.json",
        ecmaVersion: 'latest', // Allows the use of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    env: {
        node: true, // Enable Node.js global variables
    }
};
