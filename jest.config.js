// jest.config.js
const nextJest = require('next/jest');

// Next.jsの設定を取得
const createJestConfig = nextJest({
  dir: './',
});

// Jestの設定をエクスポート
module.exports = createJestConfig({
  setupFiles: ['<rootDir>/jest.setup-fetch.js'], // 追加: fetch 用セットアップ
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
});
