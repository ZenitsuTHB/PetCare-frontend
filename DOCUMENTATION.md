# PetCare Frontend - Technical Documentation

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Unique ID System](#unique-id-system)
- [Global File Management](#global-file-management)
- [Data Migration Strategy](#data-migration-strategy)
- [Context Architecture](#context-architecture)
- [Component Updates](#component-updates)
- [API Integration Ready](#api-integration-ready)
- [Development Guidelines](#development-guidelines)

---

## 🏗️ System Overview

The PetCare frontend has been enhanced with a professional-grade identification system and global state management for file operations. This implementation solves critical issues with data persistence and provides a scalable foundation for backend integration.

### Key Features Implemented

- **UUID v4 Unique Identification System**
- **Global File State Management with React Context**
- **Automatic Data Migration from Legacy Systems**
- **Real-time File Count Badges**
- **Consistent Navigation Parameters**
- **Backend-Ready Architecture**

---

## 🔑 Unique ID System

### Implementation

The system uses UUID v4 generation to ensure unique identification for all pets, replacing the previous naming-based approach that could cause collisions.

#### Core Functions (`src/utils/petUtils.js`)

```javascript
/**
 * Generates a UUID v4 for unique pet identification
 * @returns {string} UUID unique identifier
 */
export const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
```

### Benefits

- **Collision-Free**: Eliminates naming conflicts between pets
- **Immutable**: IDs remain consistent across app sessions
- **Backend Compatible**: Standard UUID format for API integration
- **Scalable**: Supports unlimited pets without conflicts

### Usage Examples

```javascript
// Generate new pet with unique ID
const newPet = await registerPet({
  name: "Max",
  species: "Perro",
  // ... other properties
});
// Result: pet.id = "a1b2c3d4-e5f6-4789-y1x2-z3a4b5c6d7e8"

// Get consistent pet ID
const petId = getPetIdImmediate(pet, petName);
```

---

## 📁 Global File Management

### Architecture Overview

The file management system uses React Context to provide global state management for pet files and vaccinations, ensuring data consistency across all application screens.

#### FilesContext Structure (`src/contexts/FilesContext.js`)

```javascript
// Data Structure
{
  [petId]: {
    files: [
      {
        id: "timestamp_id",
        fileName: "document.pdf",
        fileUri: "file://path/to/file",
        title: "Vaccination Record",
        date: "2025-10-17",
        description: "Annual vaccination",
        petId: "uuid",
        petName: "Max"
      }
    ],
    vaccinations: []
  }
}
```

#### Core Operations

```javascript
// Add file to specific pet
await addFile(petId, fileObject);

// Get all files for a pet
const petData = getPetFiles(petId);
const documents = petData.files;

// Remove file
await removeFile(petId, fileId);

// Get file count for badge
const count = getFilesCount(petId);
```

### Features

- **Persistent Storage**: AsyncStorage integration for data persistence
- **Real-time Updates**: Automatic UI updates across all screens
- **CRUD Operations**: Complete file lifecycle management
- **Type Safety**: Structured data with validation

---

## 🔄 Data Migration Strategy

### Automatic Migration System

The system includes intelligent migration to convert legacy data to the new UUID system without data loss.

#### Migration Process

1. **Detection**: Identifies legacy IDs (numeric, timestamps, names)
2. **Mapping**: Matches old data to registered pets using characteristics
3. **Conversion**: Transfers data to UUID-based keys
4. **Cleanup**: Removes old data structures
5. **Persistence**: Saves migrated data automatically

#### Migration Implementation

```javascript
// Pet Migration (PetContext)
const migratePetsToUniqueIds = async (petsArray) => {
  for (const pet of petsArray) {
    if (!pet.id || pet.id.length < 10) {
      const uniqueId = generateUniqueId();
      const migratedPet = { ...pet, id: uniqueId, _migrated: true };
      // Save with new ID
    }
  }
};

// Files Migration (FilesContext)
const migrateOldData = async (petFiles) => {
  for (const [oldId, petData] of Object.entries(petFiles)) {
    if (/^\d{1,10}$/.test(oldId)) {
      // Find matching pet by name/characteristics
      const targetPet = findPetByCharacteristics(petData);
      if (targetPet) {
        // Transfer files to new UUID
        migratedFiles[targetPet.id] = petData;
        delete migratedFiles[oldId];
      }
    }
  }
};
```

### Migration Safety

- **Non-destructive**: Original data preserved during migration
- **Validation**: Ensures data integrity before cleanup
- **Rollback**: Migration logs allow for troubleshooting
- **Performance**: Async operations prevent UI blocking

---

## 🏛️ Context Architecture

### Provider Hierarchy

```javascript
<PaperProvider>
  <PetProvider>         // Pet registration and ID management
    <FilesProvider>     // File operations and storage
      <AppNavigator />  // Application screens
    </FilesProvider>
  </PetProvider>
</PaperProvider>
```

### Context Dependencies

- **PetProvider**: Must be above FilesProvider for ID resolution
- **FilesProvider**: Depends on PetProvider for UUID mapping
- **Components**: Can access both contexts independently

### Context APIs

#### PetContext
```javascript
const {
  pets,                    // Array of registered pets
  registerPet,             // Register new pet with UUID
  getPetById,              // Get pet by UUID
  getPetIdImmediate,       // Get/resolve pet UUID
  updatePet,               // Update pet information
  loading                  // Loading state
} = usePets();
```

#### FilesContext
```javascript
const {
  getPetFiles,             // Get all files for pet
  addFile,                 // Add new file
  removeFile,              // Delete file
  getFilesCount,           // Get count for badges
  hasFiles,                // Check if pet has files
  loading                  // Loading state
} = useFiles();
```

---

## 🧩 Component Updates

### PetDetailsFooter Enhancement

The footer now displays real-time file count badges and uses consistent pet identification.

#### Badge System
```javascript
const PetDetailsFooter = ({ pet, petName, activeTab, ...handlers }) => {
  const { getFilesCount } = useFiles();
  const { getPetIdImmediate } = usePets();
  
  const petId = getPetIdImmediate(pet, petName);
  const filesCount = getFilesCount(petId);
  
  return (
    <TabItem 
      icon="folder" 
      label="Archivos" 
      badge={filesCount > 0 ? filesCount : null}
      // ...
    />
  );
};
```

### Screen Navigation Updates

All screens now use consistent navigation parameters ensuring proper pet identification.

#### Standardized Navigation
```javascript
// From any screen to Archivos
navigation.navigate('Archivos', { 
  pet: petObject, 
  petName: pet.name 
});

// Footer navigation
<PetDetailsFooter
  pet={pet}
  petName={petName}
  onArchivosPress={() => navigation.navigate('Archivos', { pet, petName })}
  // ...
/>
```

### File Upload Integration

Upload screens now save files using the UUID system with automatic context updates.

```javascript
// UploadDocumentScreen
const petId = getPetIdImmediate(pet, petName);

const handleSubmit = async () => {
  const fileData = {
    id: Date.now().toString(),
    fileName: uploadedFile.name,
    title: title.trim(),
    petId: petId,
    petName: pet?.name
  };
  
  await addFile(petId, fileData);
  // Automatic UI updates across all screens
};
```

---

## 🔗 API Integration Ready

### Backend Compatibility

The system is designed for seamless backend integration with RESTful APIs.

#### Pet Registration Endpoint
```javascript
// Frontend to Backend
POST /api/pets
{
  "id": "a1b2c3d4-e5f6-4789-y1x2-z3a4b5c6d7e8",
  "name": "Max",
  "species": "Perro",
  "chip": "CHI001234567",
  // ... other pet data
}
```

#### File Upload Endpoint
```javascript
// Frontend to Backend
POST /api/pets/{petId}/files
{
  "id": "file_unique_id",
  "petId": "a1b2c3d4-e5f6-4789-y1x2-z3a4b5c6d7e8",
  "fileName": "vaccination.pdf",
  "title": "Annual Vaccination",
  "uploadedAt": "2025-10-17T10:30:00Z"
}
```

#### Sync Strategy
```javascript
// Sync local data with backend
const syncPetData = async (petId) => {
  const localPet = getPetById(petId);
  const localFiles = getPetFiles(petId);
  
  // Send to backend
  await api.syncPet(localPet);
  await api.syncFiles(petId, localFiles);
  
  // Update local with server response
  updatePet(petId, serverResponse.pet);
};
```

---

## 🛠️ Development Guidelines

### Adding New File Types

```javascript
// 1. Update file validation in UploadDocumentScreen
const allowedTypes = [
  'application/pdf', 
  'image/png', 
  'image/jpeg',
  'application/vnd.ms-excel' // New type
];

// 2. Add icon mapping in PetDetailsFooter
const getFileIcon = (fileName) => {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'xls':
    case 'xlsx':
      return { name: 'grid', color: '#4B9B6C' };
    // ...
  }
};
```

### Adding New Pet Fields

```javascript
// 1. Update PetContext registration
const registerPet = async (petData) => {
  const petWithId = {
    id: generateUniqueId(),
    ...petData,
    newField: petData.newField, // Add new field
    registrationDate: new Date().toISOString()
  };
  // ...
};

// 2. Update migration if needed
const migrateOldData = async (pets) => {
  return pets.map(pet => ({
    ...pet,
    newField: pet.newField || 'defaultValue'
  }));
};
```

### Context Usage Best Practices

```javascript
// ✅ Correct: Use contexts in functional components
const MyComponent = () => {
  const { addFile } = useFiles();
  const { getPetIdImmediate } = usePets();
  // ...
};

// ❌ Incorrect: Don't call hooks conditionally
const MyComponent = () => {
  if (condition) {
    const { addFile } = useFiles(); // Wrong!
  }
};

// ✅ Correct: Always get pet ID consistently
const petId = getPetIdImmediate(pet, petName) || getPetIdSync(pet, petName);

// ❌ Incorrect: Don't use pet name directly as ID
const petId = pet.name; // Wrong! Can cause collisions
```

### Testing Guidelines

```javascript
// Mock contexts for testing
const mockPetContext = {
  getPetIdImmediate: jest.fn(() => 'test-uuid'),
  registerPet: jest.fn(),
  // ...
};

const mockFilesContext = {
  addFile: jest.fn(),
  getPetFiles: jest.fn(() => ({ files: [], vaccinations: [] })),
  // ...
};

// Test component with mocked contexts
render(
  <PetContext.Provider value={mockPetContext}>
    <FilesContext.Provider value={mockFilesContext}>
      <ComponentToTest />
    </FilesContext.Provider>
  </PetContext.Provider>
);
```

---

## 📊 Performance Considerations

### Memory Management

- **Lazy Loading**: Files loaded only when needed
- **Cleanup**: Automatic cleanup of temporary files
- **Batching**: Bulk operations for better performance

### Storage Optimization

- **Compression**: Large files compressed before storage
- **Caching**: Frequent data cached in memory
- **Pagination**: Large datasets paginated for performance

### Network Efficiency

- **Debouncing**: API calls debounced to prevent spam
- **Offline Support**: Local storage for offline operation
- **Sync Queuing**: Failed operations queued for retry

---

## 🔧 Troubleshooting

### Common Issues

1. **Files not appearing**: Check pet ID consistency
2. **Migration failures**: Verify AsyncStorage permissions
3. **Navigation errors**: Ensure proper parameter passing
4. **Badge not updating**: Verify context provider hierarchy

### Debug Tools

```javascript
// Enable debug logging in FilesContext
console.log('=== FILES DEBUG ===');
console.log('Pet ID:', petId);
console.log('Files found:', documents.length);

// Check migration status
console.log('=== MIGRATION DEBUG ===');
console.log('Old IDs found:', oldIds);
console.log('Migration completed:', hasChanges);
```

---

## 📈 Future Enhancements

### Planned Features

- **Cloud Storage Integration** (AWS S3, Firebase)
- **Real-time Sync** with WebSocket connections
- **Advanced Search** and filtering
- **File Sharing** between users
- **Backup and Restore** functionality

### Scalability Improvements

- **Database Integration** (SQLite for mobile)
- **Caching Layer** (Redis for web)
- **CDN Integration** for file delivery
- **Microservices Architecture** for backend

---

## 📝 Changelog

### Version 2.1.0 (Current) - Notification System
- ✅ Complete notification flow with detail and timer screens
- ✅ Professional reminder system with countdown functionality
- ✅ Multi-type notification support (vet, bonvet, user)
- ✅ Frequency-based recurring reminders
- ✅ Interactive timer with custom time inputs
- ✅ Seamless navigation flow integration

### Version 2.0.0 - File Management System
- ✅ UUID v4 identification system
- ✅ Global file management with React Context
- ✅ Automatic data migration
- ✅ Real-time badge updates
- ✅ Backend-ready architecture

### Version 1.0.0 (Legacy)
- Basic pet registration
- Local file storage
- Simple navigation
- Name-based identification

---

## 🔔 Notification System Implementation (v2.1.0)

### Overview
Complete notification management system with three-tier architecture: List → Detail → Timer. Implements professional UX patterns for healthcare reminders and veterinary appointments.

### Architecture

#### NotificationDetailScreen
**Purpose**: Expandable notification view with contextual actions
**Key Features**:
- Dynamic color schemes based on notification type
- Interactive toggle for user-editable notifications
- Action buttons: Create reminder, Edit, Share
- Contextual information display

```javascript
// Notification types with visual identity
const variants = {
  vet: { bg: '#F5FCE9', border: '#A8B88B' },    // Medical appointments
  bonvet: { bg: '#FFEADD', border: '#FFBA92' }, // Platform tips
  user: { bg: '#FDD8D8', border: '#FA8081' }    // Personal reminders
};
```

#### ReminderTimerScreen
**Purpose**: Professional timer system with recurring options
**Technical Implementation**:
- Real-time countdown with `useEffect` and `useRef`
- Custom time input (hours, minutes, seconds)
- Quick preset buttons (5m, 15m, 30m, 1h)
- Frequency selector for recurring reminders
- Automatic completion alerts

```javascript
// Core timer logic
useEffect(() => {
  if (isRunning && totalSeconds > 0) {
    intervalRef.current = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          Alert.alert('¡Tiempo cumplido!', 'El recordatorio ha terminado');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(intervalRef.current);
}, [isRunning, totalSeconds]);
```

### Navigation Flow
```
NotificationsScreen (List)
    ↓ tap notification card
NotificationDetailScreen (Detail)
    ↓ "Create reminder" button
ReminderTimerScreen (Timer)
    ↓ save/complete
Back to Notifications
```

### UI/UX Patterns

#### Visual Consistency
- Maintains app color palette (#FA8081 primary)
- SafeAreaView implementation for modern devices
- TouchableOpacity with 0.7 opacity for feedback
- Consistent spacing and typography

#### Interaction Design
- Card-based navigation with clear touch targets
- Progressive disclosure (List → Detail → Action)
- Immediate visual feedback on all interactions
- Accessible button labels and hit areas

#### State Management
- Timer state with persistent UI updates
- Form validation for time inputs
- Loading states for actions
- Error handling for edge cases

### Technical Specifications

#### File Structure
```
src/screens/Notifications/
├── NotificationsScreen.js      (Updated: added navigation)
├── NotificationDetailScreen.js (New: detail view)
└── ReminderTimerScreen.js      (New: timer system)
```

#### Dependencies
- `@react-navigation/native` for screen transitions
- `react-native-safe-area-context` for device compatibility
- `@expo/vector-icons` for consistent iconography
- Custom `BackButton` component for navigation

#### Performance Considerations
- Efficient timer cleanup with useRef
- Minimal re-renders with proper state structure
- Touch feedback without heavy animations
- Memory management for timer intervals

### Integration Points

#### Backend Readiness
- Structured data models for API integration
- UUID support for notification identification
- Standardized frequency patterns
- Error states for network failures

#### Future Enhancements
- Push notification integration
- Notification persistence with AsyncStorage
- Sync with device calendar
- Advanced scheduling options
- Analytics tracking for reminder effectiveness

*This documentation was last updated on October 17, 2025*