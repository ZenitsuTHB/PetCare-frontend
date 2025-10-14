import { API_URL } from '../../.env';

// uploadDocument: sube un archivo y metadatos asociados, con soporte para progreso
// params: { fileUri, fileName, title, date, description, petId, token, onProgress }
export const uploadDocument = ({ fileUri, fileName, title, date, description, petId, token, onProgress }) => {
  return new Promise((resolve, reject) => {
    if (!fileUri) return reject(new Error('fileUri is required'));

    const url = `${API_URL}/upload_document.php`;
    const formData = new FormData();

    formData.append('file', {
      uri: fileUri,
      name: fileName || 'document.pdf',
      type: 'application/pdf',
    });
    formData.append('title', title || '');
    formData.append('date', date || '');
    formData.append('description', description || '');
    formData.append('petId', petId || '');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    // Set headers (do not set Content-Type; let XHR set boundary)
    xhr.setRequestHeader('Accept', 'application/json');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          resolve(json);
        } catch (err) {
          resolve({ success: true, raw: xhr.responseText });
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));

    xhr.send(formData);
  });
};
