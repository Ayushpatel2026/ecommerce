const nextJest = require('next/jest')
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // Simulates a browser environment for testing React components
  moduleFileExtensions: ['js', 'jsx'], // Specifies the file types Jest should recognize
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Transforms JavaScript and JSX files using Babel
  },
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy', // Mock CSS module imports
    '\\.css$': '<rootDir>/__mocks__/styleMock.js', // Mock regular CSS files
  },
};
