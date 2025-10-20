# API Integration Tests

## Overview

This directory contains integration tests for all PetCare API endpoints. These tests run against the **real backend server** to ensure the API is working correctly.

---

## Prerequisites

### 1. Install Dependencies

```bash
npm install --save-dev jest @testing-library/react-native axios-mock-adapter
```

### 2. Configure Jest

Add to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest __tests__/api"
  },
  "jest": {
    "preset": "react-native",
    "setupFilesAfterEnv": ["<rootDir>/__tests__/setup.js"],
    "testMatch": [
      "**/__tests__/**/*.test.js"
    ],
    "transformIgnorePatterns": [
      "node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)"
    ]
  }
}
```

### 3. Create Test User

Before running tests, create a test user on your backend:

**Option A: Using the app**
1. Open the app
2. Register with email: `test@petcare.com`
3. Password: `TestPassword123!`

**Option B: Using API directly**
```bash
curl -X POST https://pablomonteserin.com/sites/borrame-bonvet/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "nombre=Test&apellidos=User&correo=test@petcare.com&contrasena=TestPassword123!&contrasena_confirmation=TestPassword123!&terminos=1"
```

### 4. Update Test Configuration

Edit `__tests__/api/api.test.js`:

```javascript
const TEST_CONFIG = {
  testUser: {
    email: 'test@petcare.com',  // Your test user email
    password: 'TestPassword123!', // Your test user password
    // ... other fields
  },
  skipRegistration: true, // Set to false if user doesn't exist yet
};
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Only API Tests

```bash
npm run test:api
```

### Watch Mode (Auto-rerun on changes)

```bash
npm run test:watch
```

### With Coverage Report

```bash
npm run test:coverage
```

---

## Test Coverage

### Authentication Endpoints ✅

- ✅ `POST /auth/register` - User registration
- ✅ `POST /auth/login` - User login (valid credentials)
- ✅ `POST /auth/login` - User login (invalid credentials)
- ✅ `GET /auth/me` - Get current user (valid token)
- ✅ `GET /auth/me` - Get current user (invalid token)
- ✅ `POST /auth/refresh` - Refresh token
- ✅ `POST /auth/logout` - Logout user

### Pet Management Endpoints ✅

- ✅ `POST /pets` - Create new pet
- ✅ `POST /pets` - Create pet with invalid data
- ✅ `GET /pets` - List all pets
- ✅ `GET /pets/:id` - Get single pet
- ✅ `PUT /pets/:id` - Update pet
- ✅ `DELETE /pets/:id` - Delete pet

### Document Upload Endpoints ⚠️

- ⚠️ `POST /upload_document.php` - Requires manual testing or E2E setup

---

## Test Structure

```
__tests__/
├── api/
│   ├── README.md           # This file
│   ├── api.test.js         # All API integration tests
│   └── mock-data.js        # Test data and fixtures (optional)
└── setup.js                # Jest setup configuration
```

---

## Understanding Test Results

### ✅ Successful Test

```
✓ POST /auth/login - Login with valid credentials (1234ms)
```

**Means:** API endpoint is working correctly.

### ❌ Failed Test

```
✕ POST /auth/login - Login with valid credentials (1234ms)

Expected: true
Received: false
```

**Troubleshooting:**
1. Check if backend server is running
2. Verify test user credentials are correct
3. Check console output for response details
4. Verify network connectivity

### ⏭️ Skipped Test

```
⏭️  Skipping registration test (user already exists)
```

**Means:** Test was intentionally skipped (controlled by `skipRegistration` flag).

---

## Common Issues & Solutions

### Issue: "Network request failed"

**Solution:**
- Ensure backend server is running
- Check base URL in `src/api/services/config.js`
- Verify network connectivity

### Issue: "401 Unauthorized"

**Solution:**
- Token might have expired
- Re-run tests to get a fresh token
- Check if logout was called before other tests

### Issue: "User already exists"

**Solution:**
- Set `skipRegistration: true` in TEST_CONFIG
- Or use a different test email

### Issue: "Cannot find module 'jest'"

**Solution:**
```bash
npm install --save-dev jest @testing-library/react-native
```

---

## Manual Testing Checklist

For endpoints that are difficult to test automatically:

### Document Upload

1. ✅ Open UploadDocumentScreen
2. ✅ Tap "Subir Archivo"
3. ✅ Select a PDF file
4. ✅ Verify file name and size appear
5. ✅ Fill in title field
6. ✅ Tap "Guardar"
7. ✅ Verify progress bar shows 0-100%
8. ✅ Verify success message appears
9. ✅ Navigate to ArchivosScreen
10. ✅ Verify document appears in list
11. ✅ Tap download button
12. ✅ Verify file can be opened

### Image Upload

1. ✅ Select PNG/JPG/JPEG file
2. ✅ Verify dynamic icon appears (image-outline)
3. ✅ Verify green color for image files
4. ✅ Complete upload process
5. ✅ Verify correct MIME type on download

---

## Best Practices

### 1. Test Isolation

Each test should be independent:
- ✅ Don't rely on test execution order
- ✅ Clean up created resources (use `DELETE`)
- ✅ Use unique identifiers (timestamps)

### 2. Descriptive Test Names

```javascript
// ✅ Good
test('POST /auth/login - Login with invalid credentials should return 401')

// ❌ Bad
test('login test')
```

### 3. Test Both Success and Failure Cases

```javascript
test('should succeed with valid data', async () => { /* ... */ });
test('should fail with invalid data', async () => { /* ... */ });
```

### 4. Use Console Logs for Debugging

```javascript
console.log('🔐 Login Response:', JSON.stringify(response, null, 2));
```

### 5. Set Appropriate Timeouts

```javascript
test('slow endpoint', async () => {
  // Test implementation
}, 30000); // 30 second timeout
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/api-tests.yml`:

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run API tests
        run: npm run test:api
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

---

## Contributing

When adding new API endpoints:

1. ✅ Add corresponding test in `api.test.js`
2. ✅ Follow existing test structure
3. ✅ Test both success and failure cases
4. ✅ Update this README with new coverage
5. ✅ Run tests before committing

---

## Support

If tests fail consistently:

1. 📝 Check console output for detailed error messages
2. 🔍 Verify backend API is working (use Postman/curl)
3. 📧 Contact backend team if API behavior is unexpected
4. 🐛 Open an issue with full error logs

---

**Last Updated:** October 20, 2025  
**Test Coverage:** 10/11 endpoints (91%)
