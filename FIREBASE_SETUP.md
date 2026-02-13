# 🔥 Firebase Setup Guide for Maiz Todo App

## Step 5: Get Your Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**
3. **Click the gear icon ⚙️** → Project settings
4. **Scroll down to "Your apps" section**
5. **Click on your web app** (or create one if you haven't)
6. **Copy the firebaseConfig object**

## Step 6: Replace the Configuration in script.js

Open `script.js` and replace lines 4-12 with your actual Firebase configuration:

```javascript
// REPLACE THIS WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef..."
};
```

## Step 7: Configure Database Rules

1. **Go to Firebase Console** → Realtime Database
2. **Click on "Rules" tab**
3. **Replace the existing rules with**:

```json
{
  "rules": {
    ".read": "true",
    ".write": "true",
    "tasks": {
      ".indexOn": ["createdAt", "priority"]
    }
  }
}
```

4. **Click "Publish"**

## 🚀 How It Works

### Real-time Sync
- **Automatic Updates**: When you add/edit/delete tasks, they sync instantly
- **Cross-device**: Open the app on multiple devices to see real-time sync
- **No Manual Refresh**: The UI updates automatically when data changes

### Firebase Functions Used
- `firebase.database()` - Initialize database
- `database.ref('tasks')` - Reference to tasks collection
- `tasksRef.set(tasks)` - Save all tasks
- `tasksRef.on('value', callback)` - Real-time listener

## 🧪 Testing Your Setup

1. **Open your app in a browser**
2. **Add a task** - it should save to Firebase
3. **Open Firebase Console** → Realtime Database → Data
4. **You should see your tasks** under the "tasks" node
5. **Test real-time sync**: Open the app in two browser windows and add tasks

## 🔒 Security Note

The current rules allow anyone to read/write your database. For production, you should implement proper authentication:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## 📱 Next Steps

1. **Add Firebase Authentication** for user accounts
2. **Structure data by user ID** for multi-user support
3. **Implement offline support** with Firebase's built-in capabilities
4. **Add cloud functions** for server-side logic

## 🐛 Troubleshooting

### Common Issues:
1. **"Firebase is not defined"** → Check Firebase SDK is loaded
2. **"Permission denied"** → Check your database rules
3. **"No data showing"** → Check your database URL in config
4. **"Real-time not working"** → Check the listener is set up correctly

### Debug Tips:
- Open browser console (F12) to see errors
- Check Firebase Console → Realtime Database → Data
- Verify your config matches the Firebase project

---

**🎉 Congratulations! Your Maiz Todo App now uses Firebase Realtime Database!**
