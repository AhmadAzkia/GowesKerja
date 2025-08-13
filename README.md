# 🚴‍♂️ GowesKerja

**Aplikasi Cycling Tracker untuk Bandung**

GowesKerja adalah aplikasi mobile yang membantu pengendara sepeda di Bandung untuk tracking perjalanan, menghemat emisi karbon, dan berkompetisi dengan sesama cyclist. Dengan fitur GPS tracking, leaderboard, dan route history, aplikasi ini menjadi teman setia untuk gowes sehari-hari!

## 🌟 Fitur Utama

- 📍 **GPS Tracking** - Real-time tracking perjalanan sepeda
- 🏆 **Leaderboard** - Kompetisi dengan sesama cyclist
- 📊 **Statistik Personal** - Track jarak, CO2 yang dihemat, dan poin
- 🗺️ **Rute Populer** - Temukan rute favorit di Bandung
- 📱 **UI Modern** - Interface yang clean dan user-friendly
- 🔐 **Firebase Auth** - Login/register yang aman

## 🛠️ Tech Stack

- **React Native** dengan Expo SDK 53
- **TypeScript** untuk type safety
- **Firebase Auth** untuk autentikasi
- **Firestore** untuk database
- **Expo Router** untuk navigasi
- **Expo Location** untuk GPS tracking
- **Expo Maps** untuk peta interaktif

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 atau lebih baru)
- Expo CLI
- Android Studio (untuk emulator) atau device Android

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/AhmadAzkia/GowesKerja.git
   cd GowesKerja
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Firebase**

   - Buat project Firebase baru di [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy `config/firebase.example.ts` ke `config/firebase.ts`
   - Update konfigurasi Firebase di `config/firebase.ts` dengan credentials Anda
   - Copy `google-services.example.json` ke `google-services.json`
   - Update `google-services.json` dengan file dari Firebase Console

4. **Run aplikasi**

   ```bash
   npx expo start
   ```

5. **Test di device**
   - Scan QR code dengan Expo Go app
   - Atau jalankan di Android emulator

## 📱 Screenshot & Demo

### Login & Register

Autentikasi yang mudah dengan email dan password

### Dashboard

Lihat statistik personal, mulai journey baru, dan akses fitur utama

### Journey Tracking

Real-time GPS tracking dengan peta interaktif

### Leaderboard

Kompetisi sehat dengan sesama cyclist Bandung

## 🏗️ Struktur Project

```
GowesKerja/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Dashboard/Home
│   │   ├── leaderboard.tsx # Leaderboard
│   │   ├── history.tsx    # Trip history
│   │   └── profile.tsx    # User profile
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Register screen
│   └── journey-tracking.tsx # GPS tracking
├── components/            # Reusable components
├── config/               # Configuration files
│   └── firebase.ts       # Firebase setup
├── services/             # Data services
│   └── mockDataService.ts # Data management
├── constants/            # App constants
└── hooks/               # Custom React hooks
```

## 🌍 Kontribusi

Aplikasi ini dibuat sebagai project personal untuk membantu komunitas cycling Bandung. Jika ada bug atau saran improvement, silakan buat issue atau pull request!

### Development Guidelines

- Gunakan TypeScript untuk semua file baru
- Follow ESLint rules yang sudah ada
- Test di real device sebelum commit
- Tulis commit message yang jelas

## 📝 Roadmap

- [ ] **v1.1**: Social features (follow cyclist lain)
- [ ] **v1.2**: Route recommendation berdasarkan AI
- [ ] **v1.3**: Integration dengan wearable devices
- [ ] **v1.4**: Offline mode untuk tracking
- [ ] **v2.0**: iOS support


## 👨‍💻 About Developer

**Ahmad Azkia** - Passionate mobile developer dari Bandung

- 🔗 GitHub: [@AhmadAzkia](https://github.com/AhmadAzkia)
- 📧 Email: ahmadazkia5@gmail.com
- 🏠 Location: Bandung, Indonesia

---

_Made with ❤️ for Bandung cycling community_ 🚴‍♂️🌿
