# API Testing Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Verify Installation ✅

Check that Jest is installed:

```bash
npm test -- --version
```

You should see Jest version information.

### Step 2: Update Test Credentials

Edit `__tests__/api/api.test.js` (line 16):

```javascript
const TEST_CONFIG = {
  testUser: {
    email: 'YOUR_TEST_EMAIL@example.com', // ← Change this
    password: 'YOUR_TEST_PASSWORD', // ← Change this
    firstName: 'Test',
    lastName: 'User',
    // ... rest stays the same
  },
  skipRegistration: true, // Set to false if user doesn't exist yet
};
```

### Step 3: Run the Tests! 🚀

```bash
npm test
```

That's it! You should see tests running against your backend.

---

## 📊 Expected Output

### Successful Run:

```
 PASS  __tests__/api/api.test.js
  PetCare API Integration Tests
    Authentication API
      ✓ POST /auth/login - Login with valid credentials (1234ms)
      ✓ POST /auth/login - Login with invalid credentials (567ms)
      ✓ GET /auth/me - Get current user with valid token (432ms)
      ✓ GET /auth/me - Get current user with invalid token (321ms)
      ✓ POST /auth/refresh - Refresh token (543ms)
    Pet Management API
      ✓ POST /pets - Create new pet (876ms)
      ✓ GET /pets - List all pets (654ms)
      ✓ GET /pets/:id - Get single pet (543ms)
      ✓ PUT /pets/:id - Update pet (789ms)
      ✓ DELETE /pets/:id - Delete pet (432ms)
      ✓ POST /pets - Create pet with invalid data (321ms)
    Logout
      ✓ POST /auth/logout - Logout user (234ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        8.456s
```

---

## 🐛 Troubleshooting

### "Network request failed"

**Problem:** Can't connect to backend server.

**Solutions:**

1. Check if backend is running: https://pablomonteserin.com/sites/borrame-bonvet
2. Verify your internet connection
3. Check base URL in `src/api/services/config.js`

**Test connection:**

```bash
curl https://pablomonteserin.com/sites/borrame-bonvet/auth/login
```

---

### "401 Unauthorized" or "Login failed"

**Problem:** Test credentials are wrong.

**Solutions:**

1. Create test user first:
   - Open your PetCare app
   - Register with email: `test@petcare.com`
   - Password: `TestPassword123!`

2. Update `TEST_CONFIG` in `__tests__/api/api.test.js`

3. Re-run tests

---

### Tests timeout (takes too long)

**Problem:** Backend is slow or network is slow.

**Solutions:**

1. Increase timeout in test file:

   ```javascript
   const TEST_CONFIG = {
     // ...
     timeout: 60000, // 60 seconds instead of 30
   };
   ```

2. Or increase globally in `__tests__/setup.js`:
   ```javascript
   jest.setTimeout(60000);
   ```

---

### "Cannot find module 'jest'"

**Problem:** Dependencies not installed.

**Solution:**

```bash
npm install --save-dev --legacy-peer-deps jest @testing-library/react-native react-test-renderer@19.1.0
```

---

## 🎯 Pro Tips

### Run Specific Test Suite

```bash
# Only authentication tests
npm test -- --testNamePattern="Authentication API"

# Only pet tests
npm test -- --testNamePattern="Pet Management"
```

### Watch Mode (Auto-rerun on file changes)

```bash
npm run test:watch
```

### See Detailed Output

```bash
npm test -- --verbose
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage report will be in: `coverage/lcov-report/index.html`

---

## 📝 Manual Testing Checklist

Some features need manual testing in the app:

### Document Upload

- [ ] Upload PDF file
- [ ] Upload PNG image
- [ ] Upload JPEG image
- [ ] Verify progress bar works
- [ ] Verify file appears in list
- [ ] Download and open file

### Authentication Flow

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout and verify token cleared
- [ ] Token persists after app restart (if implemented)

### Pet Management

- [ ] Create new pet with all fields
- [ ] Create pet with only required fields
- [ ] Update pet information
- [ ] Delete pet
- [ ] View pet details
- [ ] List shows all pets

---

## 📚 Next Steps

1. **Read Full Documentation:** `__tests__/api/README.md`
2. **Check API Architecture:** `API_DOC.md`
3. **Review Professional Analysis:** `API_ANALYSIS.md`

---

## 🆘 Still Having Issues?

1. Check console output for detailed error messages
2. Enable verbose logging:
   ```javascript
   // In src/api/services/config.js
   api.interceptors.request.use((config) => {
     console.log('📤', config.method.toUpperCase(), config.url);
     return config;
   });
   ```
3. Test endpoints manually with curl:
   ```bash
   curl -X POST https://pablomonteserin.com/sites/borrame-bonvet/auth/login \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "correo=test@petcare.com&contrasena=TestPassword123!"
   ```

---

**Happy Testing! 🧪**
