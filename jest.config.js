module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  modulePaths: ['<rootDir>'],
  testRegex: '(__tests__.*|(\\.))spec.ts',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.service.[t]s?(x)',
    '**/*.injector.[t]s?(x)',
    '!**/*.repository.service.[t]s?(x)',
  ],
  coverageReporters: ['json-summary', ['text', { file: 'coverage.txt' }]],
};
