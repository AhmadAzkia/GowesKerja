# Firebase Configuration Setup

## ⚠️ IMPORTANT SECURITY NOTE

The `config/firebase.ts` file contains sensitive API keys and should NOT be committed to version control.

## Setup Instructions

1. **Copy the template file:**
   ```bash
   cp config/firebase.template.ts config/firebase.ts
   ```

2. **Get your Firebase configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`goweskerja-ab08d`)
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the config object

3. **Replace the placeholder values in `config/firebase.ts`:**
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "goweskerja-ab08d.firebaseapp.com",
     databaseURL: "https://goweskerja-ab08d-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "goweskerja-ab08d",
     storageBucket: "goweskerja-ab08d.firebasestorage.app",
     messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
     appId: "YOUR_ACTUAL_APP_ID",
   };
   ```

4. **Enable required Firebase services:**
   - Authentication (Email/Password)
   - Realtime Database

## Security

- `config/firebase.ts` is listed in `.gitignore`
- Never commit actual API keys to version control
- Use environment variables for production deployments
