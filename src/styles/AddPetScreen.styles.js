import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f7f9fc',
    alignItems: 'center',           // centers horizontally
  },
  content: {
    width: '100%',
    maxWidth: 400,                  // limits form width for web
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  genderButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#5cb85c',
  },
  imagePicker: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    alignSelf: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
