declare module 'axios/dist/node/axios.cjs';

// Allow imports for ESM-only modules from node_modules without TypeScript errors
declare module 'axios/dist/*';

export {};
