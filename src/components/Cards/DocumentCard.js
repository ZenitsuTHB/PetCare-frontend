import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DocumentCard = ({ 
  title, 
  uploadedBy = 'Subido por ti', 
  date, 
  fileType = 'PDF',
  onDownload,
  onPress,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '00/00/00';
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch {
      return '00/00/00';
    }
  };

  // Determine icon and color based on file type
  const getFileIcon = () => {
    const type = fileType.toUpperCase();
    switch (type) {
      case 'PNG':
      case 'JPG':
      case 'JPEG':
      case 'GIF':
      case 'BMP':
      case 'SVG':
        return { name: 'image-outline', color: '#7C9A5F' };
      case 'PDF':
        return { name: 'document-text-outline', color: '#D95D5D' };
      case 'DOC':
      case 'DOCX':
        return { name: 'document-outline', color: '#5B8DBE' };
      case 'XLS':
      case 'XLSX':
        return { name: 'grid-outline', color: '#4B9B6C' };
      default:
        return { name: 'document-attach-outline', color: '#4E5641' };
    }
  };

  const fileIcon = getFileIcon();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Header with icon and title */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Ionicons name={fileIcon.name} size={24} color={fileIcon.color} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </View>
          </View>
          
          {/* Description section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.uploadedBy}>{uploadedBy}</Text>
            <Text style={styles.metadata}>
              {formatDate(date)} - Archivo {fileType}
            </Text>
          </View>
        </View>

        {/* Download button */}
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={(e) => {
            e.stopPropagation();
            onDownload?.();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={20} color="#4E5641" />
          <Text style={styles.downloadText}>Descargar documento</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: '#FAFEF5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CADDA7',
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
  header: {
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#4E5641',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '600',
    lineHeight: 32,
  },
  descriptionSection: {
    gap: 4,
  },
  uploadedBy: {
    color: '#2C2C2C',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '300',
    lineHeight: 21,
  },
  metadata: {
    color: '#2C2C2C',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '300',
    lineHeight: 16.8,
  },
  downloadButton: {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 24,
    backgroundColor: '#CADDA7',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  downloadText: {
    textAlign: 'center',
    color: '#4E5641',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '600',
    lineHeight: 21,
  },
});

export default DocumentCard;
