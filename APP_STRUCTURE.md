# 📱 Struktur Navigasi App - GowesKerja

## 🗂️ Struktur File yang Benar:

### Authentication Flow:

```
app/
├── _layout.tsx           → Root layout + Auth checker
├── login.tsx            → ✅ Login screen (UTAMA)
├── register.tsx         → ✅ Register screen (UTAMA)
└── (tabs)/              → Main app setelah login
    ├── _layout.tsx      → Tab navigation
    ├── index.tsx        → Home screen
    ├── leaderboard.tsx  → Leaderboard
    ├── history.tsx      → History perjalanan
    ├── profile.tsx      → User profile
    ├── login.tsx        → ❌ TIDAK DIGUNAKAN (duplicate)
    └── register.tsx     → ❌ TIDAK DIGUNAKAN (duplicate)
```

---

## 🔄 Alur Navigasi:

1. **App Start** → `app/_layout.tsx`

   - Cek status auth user
   - Jika belum login → redirect ke `app/login.tsx`
   - Jika sudah login → redirect ke `app/(tabs)/`

2. **Login** → `app/login.tsx`

   - Form login dengan validasi
   - Setelah berhasil → redirect ke `app/(tabs)/`
   - Link ke register → `app/register.tsx`

3. **Register** → `app/register.tsx`

   - Form register dengan validasi
   - Setelah berhasil → redirect ke `app/login.tsx`

4. **Main App** → `app/(tabs)/`
   - Tab navigation dengan 4 screens:
     - Home (index.tsx)
     - Leaderboard
     - History
     - Profile

---

## ✅ Yang Sudah Diperbaiki:

### 1. Maps di Home Screen:

- ✅ Import `MapViewComponent` dari `@/components/MapViewExpo`
- ✅ Tampilkan Google Maps dengan markers Bandung
- ✅ Fallback untuk development mode

### 2. Login System:

- ✅ Mock Firebase dengan user database proper
- ✅ Validasi email/password
- ✅ Error handling yang detail:
  - `auth/user-not-found` → "Akun tidak ditemukan"
  - `auth/wrong-password` → "Password salah"
  - `auth/email-already-in-use` → "Email sudah digunakan"

### 3. Auth Flow:

- ✅ Hanya user yang register bisa login
- ✅ Error message yang informatif
- ✅ Proper navigation between screens

---

## 🚀 Testing:

1. **Test Register:**

   ```
   Email: test@example.com
   Password: 123456
   Name: Test User
   ```

2. **Test Login (harus register dulu):**

   ```
   Email: test@example.com
   Password: 123456
   ```

3. **Test Login Gagal:**
   ```
   Email: wrong@example.com
   Password: wrong123
   ```
   → Akan muncul error "Akun tidak ditemukan"

---

## 📁 File yang TIDAK digunakan:

- `app/(tabs)/login.tsx` → Duplicate, diabaikan
- `app/(tabs)/register.tsx` → Duplicate, diabaikan

Kedua file ini bisa dihapus atau dibiarkan saja, tidak akan mengganggu karena tidak ada di tab navigation.
