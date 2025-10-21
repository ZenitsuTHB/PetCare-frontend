/**
 * Jest Setup File
 *
 * This file runs before all tests.
 * Configure global test settings, mocks, and utilities here.
 */

// Increase timeout for all tests (API calls can be slow)
jest.setTimeout(30000);

// Mock AsyncStorage for tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Suppress console warnings during tests (optional)
global.console = {
  ...console,
  warn: jest.fn(), // Suppress warnings
  // Keep error, log, info for debugging
  error: console.error,
  log: console.log,
  info: console.info,
};

// Global test utilities
global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Print test environment info
console.log('\n' + '='.repeat(80));
console.log('🧪 PetCare API Test Suite');
console.log('='.repeat(80));
console.log(`📅 Date: ${new Date().toLocaleString()}`);
console.log(`🌐 Node: ${process.version}`);
console.log(`⚙️  Jest: ${require('jest/package.json').version}`);
console.log('='.repeat(80) + '\n');
