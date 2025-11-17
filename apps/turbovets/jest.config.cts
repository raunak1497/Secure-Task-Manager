const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  displayName: '@rsingh-f74-a20-c7-9490-44-f8-8-cc6-a7-a243-dae9-d5/turbovets',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/turbovets',
  testEnvironment: 'jsdom',
};

module.exports = createJestConfig(config);
