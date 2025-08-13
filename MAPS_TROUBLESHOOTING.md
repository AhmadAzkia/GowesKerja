# Google Maps API Setup Guide - Masalah Maps Putih

## 🚨 Masalah: Maps muncul tapi putih kosong

### ✅ Solusi: Aktifkan APIs yang diperlukan di Google Cloud Console

**API Key Anda:** `AIzaSyACJ6koRoZ6NdsB2oJRvOs04UwOrlJmymM`

---

## 📋 Checklist APIs yang WAJIB diaktifkan:

### 1. Buka Google Cloud Console

🔗 https://console.cloud.google.com/

### 2. Pilih project Anda

### 3. Aktifkan APIs berikut (APIs & Services → Library):

- [ ] **Maps JavaScript API** ⭐ WAJIB
- [ ] **Maps SDK for Android** ⭐ WAJIB
- [ ] **Maps SDK for iOS** ⭐ WAJIB
- [ ] **Geocoding API** ⭐ WAJIB
- [ ] **Places API (New)** ⭐ WAJIB
- [ ] **Directions API** (untuk routing)
- [ ] **Distance Matrix API** (untuk kalkulasi jarak)

---

## 🔧 Langkah-langkah detail:

### Step 1: Maps JavaScript API

1. Pergi ke: APIs & Services → Library
2. Cari: "Maps JavaScript API"
3. Klik dan pilih "ENABLE"

### Step 2: Maps SDK for Android

1. Di Library yang sama
2. Cari: "Maps SDK for Android"
3. Klik dan pilih "ENABLE"

### Step 3: Maps SDK for iOS

1. Di Library yang sama
2. Cari: "Maps SDK for iOS"
3. Klik dan pilih "ENABLE"

### Step 4: Geocoding API

1. Di Library yang sama
2. Cari: "Geocoding API"
3. Klik dan pilih "ENABLE"

### Step 5: Places API

1. Di Library yang sama
2. Cari: "Places API (New)"
3. Klik dan pilih "ENABLE"

---

## ⚙️ Setup API Key Restrictions (Opsional):

1. Pergi ke: APIs & Services → Credentials
2. Klik pada API key Anda
3. Tambahkan restrictions:

   **Application restrictions:**

   - Android apps: `com.ahmadazkia.goweskerja`
   - HTTP referrers: `localhost:*`, `*.expo.dev`

   **API restrictions:**

   - Centang semua API yang sudah diaktifkan

---

## 🚀 Setelah mengaktifkan APIs:

1. **Tunggu 5-10 menit** (aktivasi membutuhkan waktu)
2. **Restart expo development server:**
   ```bash
   npx expo start --clear
   ```
3. **Test aplikasi lagi**

---

## 💡 Tips Troubleshooting:

- Maps putih = API belum diaktifkan
- Error "API key not valid" = restrictions terlalu ketat
- Loading terus = internet atau API quota issue
- Tidak ada search results = Places API belum aktif

---

## 📞 Jika masih bermasalah:

1. Check console logs di browser/developer tools
2. Pastikan billing account sudah disetup di Google Cloud
3. Check API quotas di Google Cloud Console
