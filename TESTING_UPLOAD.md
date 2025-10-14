# Upload Document Screen - Testing Guide

## 🌐 Testing in Browser (Web)

### Setup
1. App is running at: **http://localhost:8082**
2. Open browser DevTools (F12) and go to **Console** tab

### Step-by-Step Test

#### 1. Navigate to Upload Screen
- Go to Home → Select a pet → Click "Archivos" tab → Click "Añadir documento"
- OR directly navigate to the upload screen in your app

#### 2. Check Console Logs
All actions are logged with emojis for easy tracking:
- 🔍 = File picker starting
- ✅ = Success
- ❌ = Error
- 📄 = File data
- 💾 = Storage operation
- 📦 = Upload data

#### 3. Pick a PDF File
**Expected behavior:**
```
🔍 Starting file picker...
📄 Picker result: { ... }
✅ File picked (new API): { name, size, uri, mimeType }
✅ File set: { name: "document.pdf", size: 12345, uri: "..." }
```

**In dev mode, you'll see an alert:**
"✅ Archivo seleccionado
document.pdf
Tamaño: 12.3KB"

#### 4. Fill Form & Submit
- Enter a **Title** (required)
- Enter a **Date** (optional)
- Enter a **Description** (optional)
- Click **"Subir"** button

**Expected console logs:**
```
🚀 Submit started
✅ Validation passed
📦 Upload data: { title, date, description, fileName, fileUri, fileSize }
💾 Starting local save...
⏳ Simulating upload progress...
✅ Progress complete
💾 Saving to AsyncStorage key: documents:default
📚 Existing documents: 0
✅ Document saved: { id, name, title, date, ... }
📚 Total documents now: 1
🏁 Upload finished
```

**On screen you'll see:**
1. "Uploading..." card with progress bar (0% → 100%)
2. Success alert with two buttons:
   - "Ver Archivos" (clears form & goes back)
   - "Subir Otro" (clears form & stays)
3. Completed file card showing PDF icon + file name + size

---

## 🔧 Debug Tools (Browser Console)

### List All Saved Documents
```javascript
window.debugStorage.listAllDocuments()
```
Shows all documents in AsyncStorage

### Get Documents for Specific Pet
```javascript
window.debugStorage.getDocumentsForPet('default')
// or
window.debugStorage.getDocumentsForPet('somePetId')
```

### Clear All Documents (Reset)
```javascript
window.debugStorage.clearAllDocuments()
```

### Manual AsyncStorage Check
```javascript
// Get the raw data
const key = 'documents:default';
const data = await AsyncStorage.getItem(key);
console.log(JSON.parse(data));
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "File picker doesn't open"
**Symptoms:** No file dialog appears
**Solution:**
- Check console for errors
- On web, browser might block file picker if it's not user-initiated
- Make sure you clicked the button directly (not via automation)

### Issue 2: "File selected but not showing"
**Symptoms:** No alert or file name appears
**Solution:**
- Check console logs for `📄 Picker result`
- If result shows `canceled: true`, you cancelled the picker
- If `assets` or `type` is missing, DocumentPicker API version mismatch

### Issue 3: "Upload button stays disabled"
**Symptoms:** Can't click "Subir" even after selecting file
**Solution:**
- Check if `fileName` state is set (console: look for "✅ File set")
- Ensure file is a PDF (check `isPdf` validation in logs)
- Try selecting file again

### Issue 4: "Progress bar doesn't move"
**Symptoms:** Shows "Uploading..." but progress stays at 0%
**Solution:**
- Check console for JavaScript errors
- This shouldn't happen - progress simulation runs via setInterval
- If it hangs, there might be a blocking operation

### Issue 5: "AsyncStorage not saving"
**Symptoms:** No success alert, or documents not persisting
**Solution:**
```javascript
// Check if AsyncStorage is working
await AsyncStorage.setItem('test', 'hello');
const result = await AsyncStorage.getItem('test');
console.log('AsyncStorage test:', result); // Should print "hello"
```

### Issue 6: "File size shows empty"
**Symptoms:** Completed card shows file name but no size
**Solution:**
- Check console: `✅ File set: { size: ... }`
- If size is `undefined` or `null`, DocumentPicker didn't provide it
- On web, size should be available; on some platforms it might not be

---

## 📱 Testing on Mobile Device

### Android/iOS (Expo Go)
1. Scan QR code in terminal
2. Navigate to Upload screen
3. Tap "Subir archivo"
4. Select PDF from device
5. Fill form and submit

**Check logs via:**
```bash
# In terminal where npm start is running
# Logs will appear automatically
```

---

## ✅ Success Checklist

- [ ] File picker opens when clicking "Subir archivo"
- [ ] Only PDF files are accepted (other types show error)
- [ ] Selected file name appears below form
- [ ] File size is formatted (KB/MB)
- [ ] "X" button removes selected file
- [ ] Form inputs disabled while uploading
- [ ] Submit button shows spinner while uploading
- [ ] Progress bar animates from 0% to 100%
- [ ] Success alert appears with two options
- [ ] Completed file card shows PDF icon, name, and size
- [ ] "Ver Archivos" navigates back
- [ ] "Subir Otro" clears form and stays on page
- [ ] Can pick and upload multiple files sequentially
- [ ] Documents persist in AsyncStorage

---

## 🎯 Quick Test (1 minute)

```javascript
// 1. Open browser console
// 2. Run this:
window.debugStorage.clearAllDocuments() // Reset

// 3. Upload a PDF via UI
// 4. After success, run:
window.debugStorage.listAllDocuments() // Should show 1 document

// 5. Upload another PDF
// 6. Run again:
window.debugStorage.listAllDocuments() // Should show 2 documents
```

---

## 📊 What to Report

If something doesn't work, share:
1. **Console logs** (copy the emoji-tagged lines)
2. **Browser/Device** (Chrome/Safari/Mobile?)
3. **At what step** it fails
4. **Error message** (if any)
5. **Screenshot** of the issue

Example:
```
Issue: Progress bar not showing
Browser: Chrome 120
Console shows: 🚀 Submit started, ✅ Validation passed, but then nothing
Error: None visible
```
