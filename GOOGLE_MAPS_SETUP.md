# Google Maps Setup Instructions

## Setup Google Maps API

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS (if planning iOS release)
   - Maps JavaScript API (for web)
4. Go to "Credentials" and create a new API key
5. Restrict the API key for security:
   - For Android: Add your app's package name and SHA-1 certificate fingerprint
   - For iOS: Add your app's bundle identifier

### 2. Configure the Project

#### Step 1: Copy Configuration Files

```bash
# Copy template files
cp app.json.template app.json
cp config/maps.config.template.ts config/maps.config.ts
```

#### Step 2: Add Your API Key

1. Open `app.json` and replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key
2. Open `config/maps.config.ts` and replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key

#### Step 3: Security Setup

Make sure these files are in `.gitignore`:

- `app.json` (contains API key)
- `config/maps.config.ts` (contains API key)
- `google-services.json` (Firebase config)

### 3. Development Setup

#### For Expo Development Build

```bash
# Install dependencies
npm install react-native-maps

# Clear cache and restart
npx expo start --clear
```

#### For Production Build

Make sure to:

1. Add proper API key restrictions in Google Cloud Console
2. Test on physical device (maps don't work on simulator)
3. Verify API billing is enabled in Google Cloud Console

### 4. API Key Security Best Practices

1. **Restrict API Key Usage**:

   - Set application restrictions (Android/iOS package name)
   - Set API restrictions (only enable needed APIs)

2. **Environment-specific Keys**:

   - Use different API keys for development and production
   - Consider using Firebase Remote Config for key management

3. **Monitor Usage**:
   - Set up billing alerts in Google Cloud Console
   - Monitor API usage regularly

### 5. Troubleshooting

#### Common Issues:

1. **Map shows gray area**: Check if API key is valid and Maps SDK is enabled
2. **"For development purposes only" watermark**: API key not properly configured for production
3. **Maps not loading**: Check internet connection and API quotas

#### Debug Steps:

1. Check Expo logs for error messages
2. Verify API key in Google Cloud Console
3. Test with a simple map component first
4. Check if billing is enabled for the Google Cloud project

### 6. Alternative Map Providers

If Google Maps quota is exceeded, consider these alternatives:

- Mapbox (requires different setup)
- OpenStreetMap with react-native-maps
- Apple Maps (iOS only)

## File Structure

```
config/
├── maps.config.ts          # Your actual API key (gitignored)
├── maps.config.template.ts # Template file (committed)
app.json                    # Your actual config (gitignored)
app.json.template          # Template file (committed)
components/
├── MapView.tsx            # Reusable map component
```

## Usage Example

```tsx
import MapViewComponent from "@/components/MapView";

<MapViewComponent
  latitude={-6.2088}
  longitude={106.8456}
  showUserLocation={true}
  markers={[
    {
      id: "location-1",
      latitude: -6.2088,
      longitude: 106.8456,
      title: "Jakarta",
      description: "Capital city",
    },
  ]}
/>;
```
