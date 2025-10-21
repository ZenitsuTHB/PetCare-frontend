# PetCare REST API Documentation

## Overview

The PetCare application uses a REST API architecture for backend communication. The API is structured using **Axios** for authentication endpoints and **XMLHttpRequest** for file upload operations that require progress tracking.

---

## Architecture Overview

### Base Configuration

**Base URL:** `https://pablomonteserin.com/sites/borrame-bonvet`

**HTTP Client:** Axios (v1.12.2)

**Timeout:** 10 seconds

**Default Headers:**

```javascript
{
  Accept: 'application/json';
}
```

### File Structure

```
src/api/
├── services/
│   ├── config.js      # Axios instance configuration
│   ├── auth.js        # Authentication endpoints
│   └── pets.js        # Pet management endpoints
└── documents.js       # Document upload (XMLHttpRequest)
```

---

## API Configuration (`src/api/services/config.js`)

### Axios Instance

```javascript
export const api = axios.create({
  baseURL: 'https://pablomonteserin.com/sites/borrame-bonvet',
  headers: {
    Accept: 'application/json',
  },
  timeout: 10000,
});
```

This centralized instance is used for all authentication-related API calls.

---

## Authentication API (`src/api/services/auth.js`)

### Design Patterns

#### 1. **Payload Sanitization**

All input data is sanitized before sending to the API:

```javascript
const sanitizeValue = (value) =>
  typeof value === 'string' ? value.trim() : value;

const sanitizePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload)
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
  );
```

**Purpose:** Remove empty fields, trim strings, ensure data quality.

#### 2. **Form URL Encoding**

Authentication endpoints use `application/x-www-form-urlencoded` format:

```javascript
const toFormUrlEncoded = (payload) =>
  Object.entries(payload)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');
```

**Why:** Backend expects URL-encoded data for auth endpoints.

#### 3. **Response Normalization**

All responses are normalized to a consistent structure:

```javascript
{
  success: boolean,
  message: string,
  user?: object,      // For auth responses
  data?: any,         // For generic responses
  token?: string,     // For login/register
  errors?: object,    // Validation errors
  status?: number,    // HTTP status code
  raw: object         // Original response
}
```

### Endpoints

#### 1. **User Registration**

**Function:** `register(userInput)`

**HTTP:** `POST /auth/register`

**Content-Type:** `application/x-www-form-urlencoded`

**Input Mapping:**

```javascript
{
  firstName     → nombre
  lastName      → apellidos
  email         → correo (lowercased)
  password      → contrasena
  confirmPassword → contrasena_confirmation
  address       → domicilio
  city          → ciudad
  province      → provincia
  postalCode    → cp
  termsAccepted → terminos (converted to 0/1)
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  user: {
    nombre: "John",
    apellidos: "Doe",
    correo: "john@example.com",
    full_name: "John Doe",
    ...
  },
  token: "eyJhbGciOiJIUzI1NiIs...",
  raw: { /* original response */ }
}
```

**Error Response:**

```javascript
{
  success: false,
  message: "Error message from server",
  errors: {
    correo: ["Email already exists"],
    ...
  },
  status: 422,
  raw: { /* original response */ }
}
```

---

#### 2. **User Login**

**Function:** `login(credentials)`

**HTTP:** `POST /auth/login`

**Content-Type:** `application/x-www-form-urlencoded`

**Input Mapping:**

```javascript
{
  email    → correo (lowercased)
  password → contrasena
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  user: {
    nombre: "John",
    apellidos: "Doe",
    correo: "john@example.com",
    full_name: "John Doe"
  },
  token: "eyJhbGciOiJIUzI1NiIs...",
  raw: { /* original response */ }
}
```

**Usage Example:**

```javascript
import { login } from '../api/services/auth';

const response = await login({
  email: 'user@example.com',
  password: 'password123',
});

if (response.success) {
  const { user, token } = response;
  // Store token and user data
}
```

---

#### 3. **Get Current User**

**Function:** `getMe(token)`

**HTTP:** `GET /auth/me`

**Headers:**

```javascript
{
  Authorization: 'Bearer {token}';
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  data: {
    /* user data */
  },
  raw: { /* original response */ }
}
```

---

#### 4. **Logout**

**Function:** `logout(token)`

**HTTP:** `POST /auth/logout`

**Headers:**

```javascript
{
  Authorization: 'Bearer {token}';
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Logged out successfully",
  data: { /* response data */ },
  raw: { /* original response */ }
}
```

---

#### 5. **Refresh Token**

**Function:** `refreshToken(token)`

**HTTP:** `POST /auth/refresh`

**Headers:**

```javascript
{
  Authorization: 'Bearer {token}';
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Token refreshed",
  data: {
    token: "new_token_here"
  },
  raw: { /* original response */ }
}
```

---

## Pet Management API (`src/api/services/pets.js`)

### Overview

The Pet Management API provides full CRUD operations for managing pet records. It follows the same architectural patterns as the Authentication API with payload sanitization, form URL encoding, and response normalization.

### Design Patterns

#### 1. **Date Conversion**

Converts date from DD/MM/YYYY format to ISO format (YYYY-MM-DD):

```javascript
const toIsoDate = (value) => {
  if (!value) return undefined;
  if (typeof value !== 'string') return value;

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};
```

#### 2. **Number Conversion**

Safely converts values to numbers with validation:

```javascript
const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};
```

#### 3. **Payload Builders**

**Create Pet Payload:**

```javascript
{
  name      → nombre
  species   → especie
  breed     → raza
  gender    → genero
  birthdate → fecha_nacimiento (converted to ISO)
  chip      → chip
  weight    → peso (converted to number)
  notes     → notas
}
```

**Update Pet Payload:**

```javascript
{
  name      → nombre
  species   → especie
  breed     → raza
  gender    → genero
  birthdate → fecha_nacimiento (converted to ISO)
  weight    → peso (converted to number)
  notes     → notas
}
```

**Note:** Update payload excludes `chip` field (immutable after creation).

### Endpoints

#### 1. **List All Pets**

**Function:** `listPets(token)`

**HTTP:** `GET /pets`

**Headers:**

```javascript
{
  Authorization: 'Bearer {token}';
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  data: [
    {
      id: 1,
      nombre: "Max",
      especie: "Perro",
      raza: "Golden Retriever",
      genero: "Macho",
      fecha_nacimiento: "2020-05-15",
      chip: "123456789",
      peso: 30.5,
      notas: "Vacunas al día",
      created_at: "2025-01-10T10:00:00.000Z",
      updated_at: "2025-01-10T10:00:00.000Z"
    },
    // ... more pets
  ],
  raw: { /* original response */ }
}
```

**Usage Example:**

```javascript
import { listPets } from '../api/services/pets';

const fetchPets = async () => {
  const response = await listPets(userToken);
  if (response.success) {
    const pets = response.data;
    console.log(`Found ${pets.length} pets`);
  }
};
```

---

#### 2. **Get Single Pet**

**Function:** `getPet(id, token)`

**HTTP:** `GET /pets/{id}`

**Headers:**

```javascript
{
  Authorization: 'Bearer {token}';
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  data: {
    id: 1,
    nombre: "Max",
    especie: "Perro",
    raza: "Golden Retriever",
    genero: "Macho",
    fecha_nacimiento: "2020-05-15",
    chip: "123456789",
    peso: 30.5,
    notas: "Vacunas al día"
  },
  raw: { /* original response */ }
}
```

---

#### 3. **Create Pet**

**Function:** `createPet(payload, token)`

**HTTP:** `POST /pets`

**Content-Type:** `application/x-www-form-urlencoded`

**Headers:**

```javascript
{
  Authorization: "Bearer {token}",
  "Content-Type": "application/x-www-form-urlencoded"
}
```

**Input Example:**

```javascript
{
  name: "Max",
  species: "Perro",
  breed: "Golden Retriever",
  gender: "Macho",
  birthdate: "15/05/2020",  // DD/MM/YYYY format
  chip: "123456789",
  weight: "30.5",           // String or number
  notes: "Vacunas al día"
}
```

**Request Body (Form URL Encoded):**

```
nombre=Max&especie=Perro&raza=Golden%20Retriever&genero=Macho&fecha_nacimiento=2020-05-15&chip=123456789&peso=30.5&notas=Vacunas%20al%20d%C3%ADa
```

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  data: {
    id: 1,
    nombre: "Max",
    especie: "Perro",
    // ... pet data
  },
  raw: { /* original response */ }
}
```

**Usage Example:**

```javascript
import { createPet } from '../api/services/pets';

const handleCreatePet = async () => {
  const newPet = {
    name: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    gender: 'Macho',
    birthdate: '15/05/2020',
    chip: '123456789',
    weight: 30.5,
    notes: 'Vacunas al día',
  };

  const response = await createPet(newPet, userToken);
  if (response.success) {
    console.log('Pet created:', response.data);
  } else {
    console.error('Error:', response.message);
  }
};
```

---

#### 4. **Update Pet**

**Function:** `updatePet(id, payload, token)`

**HTTP:** `PUT /pets/{id}`

**Content-Type:** `application/x-www-form-urlencoded`

**Headers:**

```javascript
{
  Authorization: "Bearer {token}",
  "Content-Type": "application/x-www-form-urlencoded"
}
```

**Input Example:**

```javascript
{
  name: "Max",
  species: "Perro",
  breed: "Labrador",     // Updated breed
  gender: "Macho",
  birthdate: "15/05/2020",
  weight: "32",          // Updated weight
  notes: "Vacunas al día. Chequeo anual completado."
}
```

**Note:** The `chip` field is **not included** in update operations (immutable).

**Success Response:**

```javascript
{
  success: true,
  message: "Operacion completada",
  data: {
    id: 1,
    nombre: "Max",
    raza: "Labrador",     // Updated
    peso: 32,             // Updated
    // ... other fields
  },
  raw: { /* original response */ }
}
```

**Usage Example:**

```javascript
import { updatePet } from '../api/services/pets';

const handleUpdatePet = async (petId) => {
  const updates = {
    name: 'Max',
    breed: 'Labrador',
    weight: 32,
    notes: 'Vacunas al día. Chequeo anual completado.',
  };

  const response = await updatePet(petId, updates, userToken);
  if (response.success) {
    console.log('Pet updated:', response.data);
  }
};
```

---

#### 5. **Delete Pet**

**Function:** `deletePet(id, token)`

**HTTP:** `DELETE /pets/{id}`

**Headers:**

```javascript
{
  Authorization: 'Bearer {token}';
}
```

**Success Response:**

```javascript
{
  success: true,
  message: "Mascota eliminada correctamente",
  data: { /* response data */ },
  raw: { /* original response */ }
}
```

**Usage Example:**

```javascript
import { deletePet } from '../api/services/pets';

const handleDeletePet = async (petId) => {
  const response = await deletePet(petId, userToken);
  if (response.success) {
    console.log('Pet deleted successfully');
  }
};
```

---

## Document Upload API (`src/api/documents.js`)

### Why XMLHttpRequest Instead of Axios?

**Reason:** XMLHttpRequest provides native support for upload progress tracking via `xhr.upload.onprogress`, which is essential for showing upload progress bars to users.

### Upload Document Function

**Function:** `uploadDocument(params)`

**HTTP:** `POST {API_URL}/upload_document.php`

**Content-Type:** `multipart/form-data` (auto-set by XMLHttpRequest)

**Parameters:**

```javascript
{
  fileUri: string,      // Required: Local file URI
  fileName: string,     // Required: File name with extension
  title: string,        // Optional: Document title
  date: string,         // Optional: Document date
  description: string,  // Optional: Document description
  petId: string,        // Optional: Associated pet ID
  token: string,        // Optional: Auth token
  onProgress: function  // Optional: Progress callback (percent)
}
```

**Implementation Details:**

```javascript
export const uploadDocument = ({
  fileUri,
  fileName,
  title,
  date,
  description,
  petId,
  token,
  onProgress,
}) => {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/upload_document.php`;
    const formData = new FormData();

    // Append file
    formData.append('file', {
      uri: fileUri,
      name: fileName || 'document.pdf',
      type: 'application/pdf',
    });

    // Append metadata
    formData.append('title', title || '');
    formData.append('date', date || '');
    formData.append('description', description || '');
    formData.append('petId', petId || '');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    // Set headers
    xhr.setRequestHeader('Accept', 'application/json');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    // Handle completion
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          resolve(json);
        } catch (err) {
          resolve({ success: true, raw: xhr.responseText });
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
};
```

**Usage Example:**

```javascript
import { uploadDocument } from '../api/documents';

const handleUpload = async () => {
  try {
    const response = await uploadDocument({
      fileUri: 'file:///path/to/document.pdf',
      fileName: 'document.pdf',
      title: 'Medical Certificate',
      date: '2025-10-20',
      description: 'Annual checkup results',
      petId: '123',
      token: userToken,
      onProgress: (percent) => {
        console.log(`Upload progress: ${percent}%`);
        setUploadProgress(percent);
      },
    });

    if (response.success) {
      console.log('Document uploaded successfully');
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## Context Integration

### AuthContext (`src/contexts/AutContext.js`)

The authentication API is wrapped in a React Context for global state management:

```javascript
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loginUser = async (email, password) => {
    const res = await authApi.login({ email, password });

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      if (tokenValue) setToken(tokenValue);

      const resolvedUser = res.user || res.data?.user || res.data || null;
      if (resolvedUser) setUser(resolvedUser);
    }

    return res;
  };

  const registerUser = async (payload) => {
    const res = await authApi.register(payload);

    if (res.success) {
      const tokenValue = res.token ?? res.data?.token ?? null;
      if (tokenValue) setToken(tokenValue);

      if (res.user) setUser(res.user);
    }

    return res;
  };

  const logoutUser = async () => {
    await authApi.logout(token);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

**Usage in Components:**

```javascript
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AutContext';

function LoginScreen() {
  const { loginUser, user, token } = useContext(AuthContext);

  const handleLogin = async () => {
    const response = await loginUser(email, password);
    if (response.success) {
      console.log('Logged in as:', user.full_name);
      console.log('Token:', token);
    }
  };
}
```

---

### PetContext (`src/contexts/PetContext.js`)

The Pet API is wrapped in a context that provides pet state management with automatic caching and synchronization:

```javascript
export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Automatically loads pets on mount and when token changes
  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const value = {
    pets,
    loading,
    addPet, // Create new pet
    updatePet, // Update existing pet
    deletePet, // Delete pet
    refreshPets: loadPets, // Manually refresh pet list
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

// Custom hook for consuming PetContext
export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};
```

**Key Features:**

1. **Automatic Caching:** Pets are cached in AsyncStorage for offline access
2. **Token-Based Sync:** When authenticated, syncs with remote API; otherwise uses local cache
3. **Data Normalization:** Converts API responses to consistent format
4. **Optimistic Updates:** Local state updates immediately, then syncs with server
5. **Fallback Mode:** Works without authentication using local storage only

**Data Normalization:**

The context normalizes pet data from various API response formats:

```javascript
const normalizePet = (input) => ({
  id: String(input.id ?? input.pet_id ?? Date.now()),
  name: input.name ?? input.nombre ?? '',
  species: input.species ?? input.especie ?? '',
  breed: input.breed ?? input.raza ?? '',
  birthdate: formatDateToDisplay(input.birthdate ?? input.fecha_nacimiento),
  gender: input.gender ?? input.genero ?? '',
  weight: String(input.weight ?? input.peso ?? ''),
  chip: String(input.chip ?? input.numero_chip ?? ''),
  notes: input.notes ?? input.notas ?? '',
  photoUri: input.photoUri ?? input.foto_uri ?? '',
  registrationDate: formatDateToDisplay(
    input.registrationDate ?? input.created_at
  ),
  consent: input.consent ?? input.autorizado ?? true,
});
```

**Date Formatting:**

Converts ISO dates (YYYY-MM-DD) to display format (DD/MM/YYYY):

```javascript
const formatDateToDisplay = (value) => {
  if (!value) return '';

  // Handle ISO format: 2020-05-15 → 15/05/2020
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  return value;
};
```

**Usage Example:**

```javascript
import { usePets } from '../../contexts/PetContext';

function PetListScreen() {
  const { pets, loading, addPet, updatePet, deletePet, refreshPets } =
    usePets();

  const handleAddPet = async () => {
    try {
      const newPet = await addPet({
        name: 'Max',
        species: 'Perro',
        breed: 'Golden Retriever',
        gender: 'Macho',
        birthdate: '15/05/2020',
        weight: 30,
        chip: '123456789',
        notes: 'Vacunas al día',
      });
      console.log('Pet added:', newPet);
    } catch (error) {
      console.error('Failed to add pet:', error.message);
    }
  };

  const handleUpdatePet = async (petId) => {
    try {
      const updated = await updatePet(petId, {
        weight: 32,
        notes: 'Updated notes',
      });
      console.log('Pet updated:', updated);
    } catch (error) {
      console.error('Failed to update pet:', error.message);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await deletePet(petId);
      console.log('Pet deleted');
    } catch (error) {
      console.error('Failed to delete pet:', error.message);
    }
  };

  if (loading) return <Text>Loading pets...</Text>;

  return (
    <FlatList
      data={pets}
      renderItem={({ item }) => <PetCard pet={item} />}
      refreshing={loading}
      onRefresh={refreshPets}
    />
  );
}
```

**Offline Behavior:**

- **No Token (Offline/Guest Mode):**
  - Reads from AsyncStorage cache
  - All CRUD operations work locally
  - Data persists between app sessions
  - No server synchronization

- **With Token (Online/Authenticated):**
  - Fetches latest data from server on load
  - Caches server response to AsyncStorage
  - All CRUD operations sync with server
  - Local cache updated after successful API calls
  - Falls back to cache if API fails

**Error Handling:**

```javascript
const handleOperation = async () => {
  try {
    await addPet(petData);
  } catch (error) {
    // Error messages come from API response
    Alert.alert('Error', error.message);
  }
};
```

---

## Error Handling

### Error Structure

All API functions return errors in a consistent format:

```javascript
{
  success: false,
  message: "Human-readable error message",
  errors: {
    field1: ["Error for field1"],
    field2: ["Error for field2"]
  },
  status: 422,  // HTTP status code
  raw: { /* original error response */ }
}
```

### Error Handling Pattern

```javascript
const response = await login({ email, password });

if (!response.success) {
  // Display error message
  Alert.alert('Error', response.message);

  // Handle validation errors
  if (response.errors) {
    Object.entries(response.errors).forEach(([field, messages]) => {
      console.error(`${field}:`, messages.join(', '));
    });
  }

  // Handle specific status codes
  if (response.status === 401) {
    // Unauthorized
  } else if (response.status === 422) {
    // Validation error
  }
}
```

---

## Security Considerations

### 1. **Token Management**

- Tokens are passed via `Authorization: Bearer {token}` header
- Tokens should be securely stored (use `@react-native-async-storage/async-storage`)
- Implement token refresh mechanism using `refreshToken()` function

### 2. **Data Sanitization**

- All user input is sanitized before sending to API
- Email addresses are automatically lowercased
- Empty/null/undefined values are filtered out

### 3. **HTTPS**

- Base URL uses HTTPS for secure communication
- Never log sensitive data (passwords, tokens) in production

### 4. **Content-Type**

- Auth endpoints: `application/x-www-form-urlencoded`
- File uploads: `multipart/form-data`
- Response format: `application/json`

---

## Testing

### Example Test Cases

```javascript
// Test login
test('Login with valid credentials', async () => {
  const response = await login({
    email: 'test@example.com',
    password: 'password123',
  });

  expect(response.success).toBe(true);
  expect(response.token).toBeDefined();
  expect(response.user).toBeDefined();
});

// Test registration
test('Register new user', async () => {
  const response = await register({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    termsAccepted: true,
  });

  expect(response.success).toBe(true);
  expect(response.user.correo).toBe('john@example.com');
});

// Test upload with progress
test('Upload document with progress tracking', async () => {
  const progressValues = [];

  await uploadDocument({
    fileUri: 'file:///test.pdf',
    fileName: 'test.pdf',
    title: 'Test Document',
    token: 'test_token',
    onProgress: (percent) => {
      progressValues.push(percent);
    },
  });

  expect(progressValues.length).toBeGreaterThan(0);
  expect(progressValues[progressValues.length - 1]).toBe(100);
});
```

---

## Future Improvements

### Recommended Enhancements

1. **Add Request/Response Interceptors**

   ```javascript
   api.interceptors.request.use((config) => {
     // Add token automatically
     const token = getStoredToken();
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

2. **Implement Token Refresh Logic**

   ```javascript
   api.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response?.status === 401) {
         // Token expired, refresh it
         const newToken = await refreshToken(oldToken);
         // Retry original request with new token
       }
       return Promise.reject(error);
     }
   );
   ```

3. **Add TypeScript Definitions**

   ```typescript
   interface LoginResponse {
     success: boolean;
     message: string;
     user?: User;
     token?: string;
   }
   ```

4. **Implement Request Queuing**
   - Queue failed requests for retry
   - Handle offline scenarios

5. **Add API Versioning**
   ```javascript
   baseURL: 'https://pablomonteserin.com/sites/borrame-bonvet/api/v1';
   ```

---

## Summary

### Key Architectural Decisions

| Aspect           | Choice                                          | Reason                                       |
| ---------------- | ----------------------------------------------- | -------------------------------------------- |
| HTTP Client      | Axios + XMLHttpRequest                          | Axios for clean API, XHR for upload progress |
| Data Format      | URL-encoded for auth/pets, FormData for uploads | Backend requirements                         |
| Response Format  | Normalized structure                            | Consistent error handling                    |
| Error Handling   | Try-catch with detailed error objects           | Better debugging and UX                      |
| State Management | React Context (Auth + Pets)                     | Global state with caching                    |
| Data Persistence | AsyncStorage                                    | Offline support and caching                  |
| Date Format      | DD/MM/YYYY (display) ↔ YYYY-MM-DD (API)        | User-friendly display, ISO standard for API  |

### API Endpoints Summary

| Endpoint               | Method | Purpose           | Auth Required |
| ---------------------- | ------ | ----------------- | ------------- |
| `/auth/register`       | POST   | User registration | No            |
| `/auth/login`          | POST   | User login        | No            |
| `/auth/me`             | GET    | Get current user  | Yes           |
| `/auth/logout`         | POST   | Logout user       | Yes           |
| `/auth/refresh`        | POST   | Refresh token     | Yes           |
| `/pets`                | GET    | List all pets     | Yes           |
| `/pets/{id}`           | GET    | Get single pet    | Yes           |
| `/pets`                | POST   | Create new pet    | Yes           |
| `/pets/{id}`           | PUT    | Update pet        | Yes           |
| `/pets/{id}`           | DELETE | Delete pet        | Yes           |
| `/upload_document.php` | POST   | Upload document   | Optional      |

---

## Integration Checklist

### Setup Steps

1. **Install Dependencies:**

   ```bash
   npm install axios @react-native-async-storage/async-storage
   ```

2. **Configure API Base URL:**
   - Edit `src/api/services/config.js`
   - Set `API_BASE_URL` to your backend URL

3. **Wrap App with Providers:**

   ```javascript
   import { AuthProvider } from './src/contexts/AutContext';
   import { PetProvider } from './src/contexts/PetContext';

   export default function App() {
     return (
       <AuthProvider>
         <PetProvider>
           <NavigationContainer>{/* Your app */}</NavigationContainer>
         </PetProvider>
       </AuthProvider>
     );
   }
   ```

4. **Use Contexts in Components:**

   ```javascript
   import { useContext } from 'react';
   import { AuthContext } from './contexts/AutContext';
   import { usePets } from './contexts/PetContext';

   function MyScreen() {
     const { user, token } = useContext(AuthContext);
     const { pets, addPet } = usePets();
     // ... component logic
   }
   ```

### Testing Endpoints

Use tools like Postman or curl to test endpoints:

```bash
# Login
curl -X POST https://pablomonteserin.com/sites/borrame-bonvet/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "correo=user@example.com&contrasena=password123"

# List Pets (replace TOKEN)
curl -X GET https://pablomonteserin.com/sites/borrame-bonvet/pets \
  -H "Authorization: Bearer TOKEN"

# Create Pet (replace TOKEN)
curl -X POST https://pablomonteserin.com/sites/borrame-bonvet/pets \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "nombre=Max&especie=Perro&raza=Golden&genero=Macho&fecha_nacimiento=2020-05-15&peso=30"
```

---

**Document Version:** 1.1  
**Last Updated:** October 20, 2025  
**Maintainer:** PetCare Development Team

**Changelog:**

- **v1.1 (Oct 20, 2025):** Added Pet Management API documentation, PetContext integration, offline support details
- **v1.0 (Oct 20, 2025):** Initial documentation with Authentication and Document Upload APIs
