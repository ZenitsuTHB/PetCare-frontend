// Debug utility to inspect AsyncStorage documents
import AsyncStorage from '@react-native-async-storage/async-storage';

export const listAllDocuments = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📦 All AsyncStorage keys:', allKeys);
    
    const documentKeys = allKeys.filter(key => key.startsWith('documents:'));
    console.log('📄 Document keys found:', documentKeys);
    
    for (const key of documentKeys) {
      const data = await AsyncStorage.getItem(key);
      const parsed = data ? JSON.parse(data) : [];
      console.log(`\n📚 ${key}:`, parsed.length, 'documents');
      parsed.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.name} (${doc.title}) - ${doc.size} bytes`);
      });
    }
    
    return documentKeys;
  } catch (error) {
    console.error('❌ Error listing documents:', error);
    return [];
  }
};

export const clearAllDocuments = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const documentKeys = allKeys.filter(key => key.startsWith('documents:'));
    
    for (const key of documentKeys) {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️  Cleared: ${key}`);
    }
    
    console.log('✅ All documents cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing documents:', error);
    return false;
  }
};

export const getDocumentsForPet = async (petId) => {
  try {
    const key = `documents:${petId || 'default'}`;
    const data = await AsyncStorage.getItem(key);
    const documents = data ? JSON.parse(data) : [];
    console.log(`📄 Documents for ${key}:`, documents);
    return documents;
  } catch (error) {
    console.error('❌ Error getting documents:', error);
    return [];
  }
};

// Export these to global for easy browser console access
if (typeof window !== 'undefined') {
  window.debugStorage = {
    listAllDocuments,
    clearAllDocuments,
    getDocumentsForPet,
  };
  console.log('🔧 Debug tools available: window.debugStorage');
}
