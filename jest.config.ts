const jestConfig = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['<rootDir>/src/tests/*.test.(ts|js)'],
    verbose: true,
    clearMocks: true,
    transform: {
      '^.+\\.(ts|js)$': 'ts-jest',
    },
    transformIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default jestConfig;
