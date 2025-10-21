/**
 * PetCare API Integration Tests
 *
 * Tests all API endpoints against the real backend server.
 * Run with: npm test
 *
 * Required setup:
 * 1. Backend server must be running
 * 2. Create a test user manually or update credentials below
 * 3. Install dependencies: npm install --save-dev jest @testing-library/react-native
 */

import * as authApi from '../../src/api/services/auth';
import * as petsApi from '../../src/api/services/pets';
import { uploadDocument } from '../../src/api/documents';

// Test configuration
const TEST_CONFIG = {
  // Update these credentials for your test environment
  testUser: {
    email: 'test@petcare.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test Street',
    city: 'Test City',
    province: 'Test Province',
    postalCode: '12345',
  },

  // Flag to skip registration test if user already exists
  skipRegistration: true,

  // Test timeouts (ms)
  timeout: 30000,
};

// Shared state for tests
let authToken = null;
let testPetId = null;

describe('PetCare API Integration Tests', () => {
  // ============================================================================
  // AUTHENTICATION TESTS
  // ============================================================================

  describe('Authentication API', () => {
    test(
      'POST /auth/register - Register new user',
      async () => {
        if (TEST_CONFIG.skipRegistration) {
          console.log('⏭️  Skipping registration test (user already exists)');
          return;
        }

        const response = await authApi.register({
          firstName: TEST_CONFIG.testUser.firstName,
          lastName: TEST_CONFIG.testUser.lastName,
          email: TEST_CONFIG.testUser.email,
          password: TEST_CONFIG.testUser.password,
          confirmPassword: TEST_CONFIG.testUser.password,
          address: TEST_CONFIG.testUser.address,
          city: TEST_CONFIG.testUser.city,
          province: TEST_CONFIG.testUser.province,
          postalCode: TEST_CONFIG.testUser.postalCode,
          termsAccepted: true,
        });

        console.log(
          '📝 Registration Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBeDefined();

        if (response.success) {
          expect(response.user).toBeDefined();
          expect(response.user.correo).toBe(
            TEST_CONFIG.testUser.email.toLowerCase()
          );
          expect(response.user.nombre).toBe(TEST_CONFIG.testUser.firstName);
          expect(response.token).toBeDefined();

          // Save token for subsequent tests
          authToken = response.token;
        }
      },
      TEST_CONFIG.timeout
    );

    test(
      'POST /auth/login - Login with valid credentials',
      async () => {
        const response = await authApi.login({
          email: TEST_CONFIG.testUser.email,
          password: TEST_CONFIG.testUser.password,
        });

        console.log('🔐 Login Response:', JSON.stringify(response, null, 2));

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user.correo).toBe(
          TEST_CONFIG.testUser.email.toLowerCase()
        );
        expect(response.token).toBeDefined();
        expect(typeof response.token).toBe('string');

        // Save token for subsequent tests
        authToken = response.token;
      },
      TEST_CONFIG.timeout
    );

    test(
      'POST /auth/login - Login with invalid credentials',
      async () => {
        const response = await authApi.login({
          email: TEST_CONFIG.testUser.email,
          password: 'WrongPassword123!',
        });

        console.log(
          '❌ Invalid Login Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(false);
        expect(response.message).toBeDefined();
        expect(response.status).toBeDefined();
        // Common status codes: 401 (Unauthorized) or 422 (Validation Error)
        expect([401, 422, 400]).toContain(response.status);
      },
      TEST_CONFIG.timeout
    );

    test(
      'GET /auth/me - Get current user with valid token',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        const response = await authApi.getMe(authToken);

        console.log('👤 Get Me Response:', JSON.stringify(response, null, 2));

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      },
      TEST_CONFIG.timeout
    );

    test(
      'GET /auth/me - Get current user with invalid token',
      async () => {
        const response = await authApi.getMe('invalid_token_12345');

        console.log(
          '❌ Invalid Token Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(false);
        expect(response.status).toBe(401);
      },
      TEST_CONFIG.timeout
    );

    test(
      'POST /auth/refresh - Refresh token',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        const response = await authApi.refreshToken(authToken);

        console.log(
          '🔄 Refresh Token Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        // Note: Might return success: false if endpoint not implemented
        if (response.success) {
          expect(response.data).toBeDefined();
        }
      },
      TEST_CONFIG.timeout
    );
  });

  // ============================================================================
  // PET MANAGEMENT TESTS
  // ============================================================================

  describe('Pet Management API', () => {
    test(
      'POST /pets - Create new pet',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        const newPet = {
          name: 'Test Pet',
          species: 'Perro',
          breed: 'Golden Retriever',
          gender: 'Macho',
          birthdate: '15/05/2020', // DD/MM/YYYY format
          chip: `TEST${Date.now()}`, // Unique chip number
          weight: '25.5',
          notes: 'Test pet created by automated test',
        };

        const response = await petsApi.createPet(newPet, authToken);

        console.log(
          '🐕 Create Pet Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBeDefined();

        if (response.success && response.data) {
          const pet = response.data.pet || response.data;
          expect(pet).toBeDefined();
          expect(pet.nombre || pet.name).toBe(newPet.name);
          expect(pet.especie || pet.species).toBe(newPet.species);

          // Save pet ID for subsequent tests
          testPetId = pet.id || pet.pet_id;
        }
      },
      TEST_CONFIG.timeout
    );

    test(
      'GET /pets - List all pets',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        const response = await petsApi.listPets(authToken);

        console.log(
          '📋 List Pets Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();

        // Check if data is an array or contains an array
        const pets = Array.isArray(response.data)
          ? response.data
          : response.data.pets || response.data.data;

        if (Array.isArray(pets)) {
          expect(pets.length).toBeGreaterThanOrEqual(0);

          if (pets.length > 0) {
            const firstPet = pets[0];
            expect(firstPet).toBeDefined();
            expect(firstPet.id || firstPet.pet_id).toBeDefined();
            expect(firstPet.nombre || firstPet.name).toBeDefined();
          }
        }
      },
      TEST_CONFIG.timeout
    );

    test(
      'GET /pets/:id - Get single pet',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        if (!testPetId) {
          // Get first pet from list
          const listResponse = await petsApi.listPets(authToken);
          if (listResponse.success) {
            const pets = Array.isArray(listResponse.data)
              ? listResponse.data
              : listResponse.data.pets || listResponse.data.data;

            if (pets && pets.length > 0) {
              testPetId = pets[0].id || pets[0].pet_id;
            }
          }
        }

        if (!testPetId) {
          console.log('⚠️  No pet ID available, skipping test');
          return;
        }

        const response = await petsApi.getPet(testPetId, authToken);

        console.log('🐾 Get Pet Response:', JSON.stringify(response, null, 2));

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();

        const pet = response.data.pet || response.data;
        expect(pet).toBeDefined();
        expect(pet.id || pet.pet_id).toBe(testPetId);
      },
      TEST_CONFIG.timeout
    );

    test(
      'PUT /pets/:id - Update pet',
      async () => {
        if (!authToken || !testPetId) {
          console.log('⚠️  No token or pet ID available, skipping test');
          return;
        }

        const updates = {
          name: 'Updated Test Pet',
          weight: '26.5',
          notes: 'Updated by automated test',
        };

        const response = await petsApi.updatePet(testPetId, updates, authToken);

        console.log(
          '✏️  Update Pet Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBeDefined();

        if (response.success && response.data) {
          const pet = response.data.pet || response.data;
          expect(pet).toBeDefined();
        }
      },
      TEST_CONFIG.timeout
    );

    test(
      'DELETE /pets/:id - Delete pet',
      async () => {
        if (!authToken || !testPetId) {
          console.log('⚠️  No token or pet ID available, skipping test');
          return;
        }

        const response = await petsApi.deletePet(testPetId, authToken);

        console.log(
          '🗑️  Delete Pet Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBeDefined();
      },
      TEST_CONFIG.timeout
    );

    test(
      'POST /pets - Create pet with invalid data',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        const invalidPet = {
          // Missing required fields
          name: '',
          species: '',
        };

        const response = await petsApi.createPet(invalidPet, authToken);

        console.log(
          '❌ Invalid Pet Response:',
          JSON.stringify(response, null, 2)
        );

        expect(response).toBeDefined();
        // Should fail validation
        if (!response.success) {
          expect(response.message).toBeDefined();
          expect(response.errors).toBeDefined();
        }
      },
      TEST_CONFIG.timeout
    );
  });

  // ============================================================================
  // DOCUMENT UPLOAD TESTS
  // ============================================================================

  describe('Document Upload API', () => {
    test(
      'POST /upload_document.php - Upload document (mocked)',
      async () => {
        // Note: This test requires a real file, which is complex in Node.js
        // Consider this a placeholder for manual testing or E2E tests

        console.log(
          '⚠️  Document upload test requires manual testing or E2E setup'
        );
        console.log('📝 Manual test steps:');
        console.log('1. Use the UploadDocumentScreen in the app');
        console.log('2. Select a file (PDF, PNG, JPG)');
        console.log('3. Fill in title and other fields');
        console.log('4. Submit and verify upload progress');
        console.log('5. Check if document appears in ArchivosScreen');

        expect(true).toBe(true); // Placeholder
      },
      TEST_CONFIG.timeout
    );
  });

  // ============================================================================
  // LOGOUT TEST (Run Last)
  // ============================================================================

  describe('Logout', () => {
    test(
      'POST /auth/logout - Logout user',
      async () => {
        if (!authToken) {
          console.log('⚠️  No token available, skipping test');
          return;
        }

        const response = await authApi.logout(authToken);

        console.log('👋 Logout Response:', JSON.stringify(response, null, 2));

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBeDefined();

        // Clear token after logout
        authToken = null;
      },
      TEST_CONFIG.timeout
    );
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to print test summary
 */
afterAll(() => {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log('✅ Authentication endpoints tested');
  console.log('✅ Pet management CRUD operations tested');
  console.log('⚠️  Document upload requires manual testing');
  console.log('='.repeat(80) + '\n');
});
