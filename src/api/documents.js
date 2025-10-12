import { API_URL } from '../../.env';

// uploadDocument: sube un archivo y metadatos asociados
// params: { fileUri, fileName, title, date, description, petId, token }
export const uploadDocument = async ({ fileUri, fileName, title, date, description, petId, token }) => {
  if (!fileUri) {
    throw new Error('fileUri is required');
  }

  const formData = new FormData();

  // En Android/iOS con expo, fileUri debe incluir el scheme "file://" para que fetch funcione.
  formData.append('file', {
    uri: fileUri,
    name: fileName || 'document.pdf',
    type: 'application/octet-stream',
  });
  formData.append('title', title || '');
  formData.append('date', date || '');
  formData.append('description', description || '');
  formData.append('petId', petId || '');

  const headers = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(`${API_URL}/upload_document.php`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Upload failed: ${resp.status} ${text}`);
  }

  return await resp.json();
};
