# Android App Configuration Guide

This guide explains how to configure the Android app to connect to your deployed Railway backend.

## 📱 How the Android App Works

The Android app has a built-in settings screen where you can configure the backend URL. Here's how it works:

### Current Configuration
- **Default URL**: `https://your-railway-app.railway.app/api/clipboard`
- **Storage**: Uses Android SharedPreferences to store the URL
- **Access**: Settings screen accessible from the main app

## 🔧 How to Update the API URL

### Method 1: Through the App Settings (Recommended)

1. **Open the Android App** on your device
2. **Click "Go to Settings"** button on the main screen
3. **Update the Backend URL** field with your Railway URL:
   ```
   https://your-railway-app.railway.app/api/clipboard
   ```
4. **The URL is automatically saved** when you type

### Method 2: Programmatically (For Developers)

You can also update the URL programmatically:

```kotlin
val prefs = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
prefs.edit().putString("backend_url", "https://your-railway-app.railway.app/api/clipboard").apply()
```

## 🚀 Railway URL Format

After deploying to Railway, your URLs will be:

- **Main Application**: `https://your-app-name.railway.app`
- **API Endpoint**: `https://your-app-name.railway.app/api/clipboard`

### Example URLs:
```
https://paysafe-security.railway.app/api/clipboard
https://paysafe-backend.railway.app/api/clipboard
https://your-custom-name.railway.app/api/clipboard
```

## 📋 Step-by-Step Setup

### 1. Deploy to Railway
Follow the Railway deployment guide in the main README.md

### 2. Get Your Railway URL
- Go to your Railway dashboard
- Copy the URL of your deployed service
- Add `/api/clipboard` to the end

### 3. Update Android App
1. Install the Android app on your device
2. Open the app
3. Click "Go to Settings"
4. Enter your Railway URL
5. The app will automatically connect to your backend

## 🔍 How the Connection Works

The Android app sends clipboard data to your Railway backend:

1. **Clipboard Change Detected** → Android app captures the text
2. **HTTP POST Request** → Sends to your Railway URL
3. **ML Processing** → Your Python API analyzes the text
4. **Response** → Returns prediction results
5. **Notification** → Shows result on Android device

### Request Format:
```json
{
  "clipboard": "text from clipboard"
}
```

### Response Format:
```json
{
  "status": "SAFE|UNSAFE|UNSURE",
  "probability": 85.5
}
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Check your Railway URL is correct
   - Ensure Railway service is running
   - Verify internet connection

2. **Wrong Endpoint**
   - Make sure you're using `/api/clipboard` endpoint
   - Not `/predict` (that's for the Python API directly)

3. **CORS Issues**
   - Railway handles CORS automatically
   - If issues persist, check Railway logs

### Testing the Connection:

1. **Test URL in Browser**:
   ```
   https://your-railway-app.railway.app/
   ```
   Should show a health check response

2. **Test API Endpoint**:
   ```bash
   curl -X POST https://your-railway-app.railway.app/api/clipboard \
     -H "Content-Type: application/json" \
     -d '{"clipboard": "test message"}'
   ```

## 📱 Building the Android App

To build and install the Android app:

1. **Open in Android Studio**:
   ```bash
   cd clipboard-monitor
   # Open Android Studio and import the project
   ```

2. **Build and Install**:
   - Connect your Android device
   - Click "Run" in Android Studio
   - Or build APK: `./gradlew assembleDebug`

3. **Enable Developer Options** (if needed):
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Enable USB Debugging

## 🔐 Permissions Required

The Android app needs these permissions:
- **Clipboard Access**: To monitor clipboard changes
- **Internet**: To connect to Railway backend
- **Notifications**: To show scan results
- **Accessibility**: For clipboard monitoring service

## 📞 Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Verify the URL format is correct
3. Test the API endpoint manually
4. Check Android app logs in Android Studio 