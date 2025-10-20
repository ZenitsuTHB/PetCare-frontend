# Quick Fixes - Priority Improvements

## 🔴 Priority 1: Token Persistence (15 minutes)

### Current Problem
```javascript
// Token is lost on app restart
const [token, setToken] = useState(null);
```

### Solution: Add SecureStore

#### Step 1: Install
```bash
npx expo install expo-secure-store
```

#### Step 2: Update AuthContext.js

Replace your current AuthContext with this:

```javascript
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as authApi from '../api/services/auth';

export const AuthContext = createContext();

// Helper functions for secure storage
const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const loadToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error loading token:', error);
    return null;
  }
};

const saveUser = async (user) => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const loadUser = async () => {
  try {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};

const clearAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth on mount
  useEffect(() => {
    const loadSavedAuth = async () => {
      const savedToken = await loadToken();
      const savedUser = await loadUser();
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
      
      setIsLoading(false);
    };

    loadSavedAuth();
  }, []);

  const loginUser = async (email, password) => {
    const res = await authApi.login({ email, password });

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      const resolvedUser = res.user || res.data?.user || res.data || null;

      if (tokenValue && resolvedUser) {
        // Save to SecureStore
        await saveToken(tokenValue);
        await saveUser(resolvedUser);
        
        // Update state
        setToken(tokenValue);
        setUser(resolvedUser);
      }
    }

    return res;
  };

  const registerUser = async (payload) => {
    const res = await authApi.register(payload);

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;

      if (tokenValue && res.user) {
        // Save to SecureStore
        await saveToken(tokenValue);
        await saveUser(res.user);
        
        // Update state
        setToken(tokenValue);
        setUser(res.user);
      }
    }

    return res;
  };

  const logoutUser = async () => {
    // Call API
    await authApi.logout(token);
    
    // Clear SecureStore
    await clearAuth();
    
    // Clear state
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider 
      value={{ user, token, loginUser, registerUser, logoutUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

#### Step 3: Update App.js to handle loading

```javascript
import { AuthContext } from './src/contexts/AutContext';

function App() {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />; // Or your loading component
  }

  return (
    // Your app navigation
  );
}
```

**Result:** ✅ Token persists across app restarts!

---

## 🟡 Priority 2: Request Interceptors (10 minutes)

### Current Problem
```javascript
// Must pass token to every call
await listPets(token);
await createPet(data, token);
await getPet(id, token);
```

### Solution: Auto-inject token

#### Update src/api/services/config.js

```javascript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://pablomonteserin.com/sites/borrame-bonvet';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Auto-inject token
api.interceptors.request.use(
  async (config) => {
    // Get token from SecureStore
    const token = await SecureStore.getItemAsync('userToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log in dev mode
    if (__DEV__) {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Log and handle errors
api.interceptors.response.use(
  (response) => {
    // Log in dev mode
    if (__DEV__) {
      console.log(`📥 ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log errors in dev mode
    if (__DEV__) {
      console.error(
        `❌ ${error.config?.url}`,
        error.response?.status,
        error.response?.data?.message
      );
    }

    // Handle 401 - Token expired
    if (error.response?.status === 401) {
      // You can trigger logout or token refresh here
      console.warn('Token expired or invalid');
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### Update API functions to NOT require token

**Before:**
```javascript
export const listPets = async (token) => {
  try {
    const { data } = await api.get('/pets', authConfig(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};
```

**After:**
```javascript
export const listPets = async () => {
  try {
    const { data } = await api.get('/pets');
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};
```

#### Update usage in components

**Before:**
```javascript
const { token } = useContext(AuthContext);
const response = await listPets(token);
```

**After:**
```javascript
// Token is auto-injected!
const response = await listPets();
```

**Result:** ✅ Much cleaner code, no more manual token passing!

---

## 🟡 Priority 3: Retry Logic (10 minutes)

### Install axios-retry

```bash
npm install axios-retry
```

### Update config.js

```javascript
import axios from 'axios';
import axiosRetry from 'axios-retry';

// ... existing config ...

// Add retry logic
axiosRetry(api, {
  retries: 3, // Retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay, // 1s, 2s, 4s
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status >= 500
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`🔄 Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});
```

**Result:** ✅ Automatic retry on network failures!

---

## 🟢 Priority 4: Replace XMLHttpRequest with Axios (5 minutes)

### Current: documents.js uses XMLHttpRequest

### Updated: Use Axios with upload progress

Replace `src/api/documents.js` with:

```javascript
import api from './services/config';

export const uploadDocument = async ({
  fileUri,
  fileName,
  title,
  date,
  description,
  petId,
  onProgress,
}) => {
  const formData = new FormData();

  // Append file
  formData.append('file', {
    uri: fileUri,
    name: fileName || 'document.pdf',
    type: 'application/pdf',
  });

  // Append metadata
  if (title) formData.append('title', title);
  if (date) formData.append('date', date);
  if (description) formData.append('description', description);
  if (petId) formData.append('petId', petId);

  try {
    const response = await api.post('/upload_document.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && typeof onProgress === 'function') {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Upload failed',
      error,
    };
  }
};
```

**Result:** ✅ Consistent error handling, interceptors work on uploads!

---

## 📊 Impact Summary

| Fix | Time | Benefit | Priority |
|-----|------|---------|----------|
| Token Persistence | 15 min | Users stay logged in | 🔴 Critical |
| Request Interceptors | 10 min | Cleaner code, auto-auth | 🟡 High |
| Retry Logic | 10 min | Better reliability | 🟡 Medium |
| Axios Upload | 5 min | Consistency | 🟢 Low |
| **Total** | **40 min** | **Production-ready** | - |

---

## ✅ Implementation Checklist

- [ ] Install expo-secure-store
- [ ] Update AuthContext with SecureStore
- [ ] Add request/response interceptors
- [ ] Remove token parameter from API functions
- [ ] Update all API calls to not pass token
- [ ] Install axios-retry
- [ ] Add retry configuration
- [ ] Replace XMLHttpRequest with Axios
- [ ] Test login persistence
- [ ] Run API tests: `npm test`

---

## 🧪 Testing After Changes

```bash
# 1. Test token persistence
# - Login
# - Close app completely
# - Reopen app
# - Should still be logged in ✅

# 2. Test interceptors
# - Check console for 📤 📥 emoji logs
# - Verify API calls work without passing token

# 3. Run automated tests
npm test

# 4. Test network retry
# - Turn on airplane mode
# - Make API call
# - Turn off airplane mode
# - Should auto-retry ✅
```

---

## 📚 References

- **SecureStore Docs:** https://docs.expo.dev/versions/latest/sdk/securestore/
- **Axios Interceptors:** https://axios-http.com/docs/interceptors
- **Axios Retry:** https://github.com/softonic/axios-retry

---

**Time to implement all fixes:** ~40 minutes  
**Impact:** ⭐⭐⭐⭐⭐ (Transforms from 7/10 to 9/10)
