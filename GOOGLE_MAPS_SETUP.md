# 🗺️ Google Maps Setup Guide - UPDATED

## API Keys yang Perlu Dienable di Google Cloud Console

### 1. **Maps SDK for Android**

- ✅ Sudah dienable
- Digunakan untuk: Menampilkan peta di aplikasi Android

### 2. **Maps SDK for iOS**

- ✅ Sudah dienable
- Digunakan untuk: Menampilkan peta di aplikasi iOS

### 3. **🔥 API Tambahan yang SANGAT DIREKOMENDASIKAN:**

#### **Places API**

- **Fungsi**: Pencarian tempat, autocomplete destinasi
- **Benefit**: User bisa search "Gedung Sate", "Kampus UNIKOM", dll
- **Cost**: $17 per 1000 requests (ada free tier)

#### **Directions API**

- **Fungsi**: Menghitung rute optimal dari A ke B
- **Benefit**: Rute yang akurat, estimasi waktu tempuh
- **Cost**: $5 per 1000 requests

#### **Distance Matrix API**

- **Fungsi**: Menghitung jarak antar titik
- **Benefit**: Estimasi jarak yang lebih akurat
- **Cost**: $5 per 1000 requests

#### **Geocoding API**

- **Fungsi**: Convert alamat ke koordinat (dan sebaliknya)
- **Benefit**: User bisa input alamat text
- **Cost**: $5 per 1000 requests

## 🚀 Setup Steps

### Step 1: Enable APIs

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project yang sama dengan Firebase
3. Navigation Menu → APIs & Services → Library
4. Search dan enable:
   - ✅ Maps SDK for Android (sudah)
   - ✅ Maps SDK for iOS (sudah)
   - 🔥 Places API (recommended)
   - 🔥 Directions API (recommended)
   - Distance Matrix API (optional)
   - Geocoding API (optional)

### Step 2: Create API Keys

1. APIs & Services → Credentials
2. Create Credentials → API Key
3. Copy API key yang dihasilkan

### Step 3: Secure API Keys

1. Edit API key yang dibuat
2. Application restrictions:
   - **Android**: Add package name `com.ahmadazkia.goweskerja`
   - **iOS**: Add bundle identifier
3. API restrictions: Pilih APIs yang dibutuhkan saja

### Step 4: Update Application

1. Replace `YOUR_GOOGLE_MAPS_API_KEY` di `android/app/src/main/AndroidManifest.xml`
2. Untuk iOS, tambahkan ke `ios/GowesKerja/Info.plist`:
   ```xml
   <key>GMSApiKey</key>
   <string>YOUR_API_KEY_HERE</string>
   ```

## 💰 Cost Estimation (Monthly)

Asumsi: 100 user aktif, 5 trip per user per bulan = 500 trips

- **Maps Display**: FREE (sampai quota tinggi)
- **Places API**: 500 searches × $0.017 = $8.5
- **Directions API**: 500 routes × $0.005 = $2.5
- **Total**: ~$11/month

**Google gives $200 free credits per month**, jadi kemungkinan besar GRATIS!

## 🎯 Rekomendasi Prioritas

### **Must Have (Sekarang)**

1. ✅ Maps SDK Android/iOS - Sudah ada
2. 🔥 **Places API** - Untuk search destinasi yang proper

### **Nice to Have (Nanti)**

1. Directions API - Untuk rute yang lebih akurat
2. Geocoding API - Untuk input alamat text
3. Distance Matrix API - Untuk kalkulasi jarak yang presisi

## 🛠️ Implementation Notes

Setelah enable Places API, kita bisa ganti mock search di `start-journey.tsx` dengan real Google Places search:

```typescript
// Ganti yang ini (mock):
const mockResults: Destination[] = [...]

// Dengan ini (real):
const response = await fetch(
  `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&radius=50000&key=${API_KEY}`
);
```

## 🔒 Security Best Practices

1. **Never commit API keys** ke Git
2. Gunakan **environment variables**
3. Set **API restrictions** yang ketat
4. Monitor usage di Google Cloud Console
5. Set **billing alerts**

## 📱 Testing

Setelah setup:

1. Test maps display ✅
2. Test location permission ✅
3. Test Places search (setelah enable)
4. Test pada device fisik (emulator kadang bermasalah)

---

**Next Action**: Enable Places API untuk fitur search destinasi yang lebih baik! 🎯

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
