# ACTO Frontend

Yapay Zeka Destekli Sosyal Deneyim Platformu — React Frontend

## 🛠️ Teknoloji Stack

| Teknoloji | Versiyon | Açıklama |
|-----------|---------|----------|
| React | 18.2 | UI framework |
| React Router DOM | 6.x | Client-side routing |
| Vite | 5.x | Build tool & dev server |
| CSS Modules | — | Scoped styling |

> **Not:** Harici CSS kütüphanesi kullanılmadı. Tüm stiller CSS Modules + global.css ile yazıldı.

---

## 📁 Proje Yapısı

```
src/
├── main.jsx                   # Uygulama giriş noktası
├── App.jsx                    # Route tanımları, global state
│
├── pages/
│   ├── HomePage.jsx           # Ana sayfa (hero, arama, etkinlikler)
│   ├── EventsPage.jsx         # Etkinlik listesi + filtreleme
│   ├── HowPage.jsx            # Nasıl çalışır + SSS
│   ├── ProfilePage.jsx        # Kullanıcı profili (sekmeli)
│   ├── CreatePage.jsx         # Etkinlik/Workshop oluşturma
│   └── NotFoundPage.jsx       # 404
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx         # Sticky navbar, dropdown menü
│   │   └── Footer.jsx         # Site altlığı
│   └── ui/
│       ├── EventCard.jsx      # Etkinlik kartı
│       ├── AuthModal.jsx      # Giriş / Kayıt modal (2 adım)
│       ├── CityInput.jsx      # Şehir autocomplete (81 il)
│       └── Toast.jsx          # Bildirim toast
│
├── hooks/
│   └── useFilter.js           # Arama + filtreleme mantığı
│
├── data/
│   ├── events.js              # Mock etkinlik verileri + sabitler
│   ├── cities.js              # 81 Türkiye ili
│   └── profile.js             # Rozetler, aktiviteler, ilgi alanları
│
└── styles/
    └── global.css             # Design tokens (CSS vars), global stiller
```

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler
- Node.js 18+
- npm 9+

### Adımlar

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Geliştirme sunucusunu başlat
npm run dev

# Uygulama http://localhost:3000 adresinde çalışır
```

### Build

```bash
npm run build    # dist/ klasörüne production build
npm run preview  # build önizleme
```

---

## 📡 Backend Entegrasyonu

Şu an mock data kullanılıyor. Spring Boot API'ye bağlamak için:

```js
// src/services/api.js oluştur
const BASE = 'http://localhost:8080/api/v1'

export const getEvents = () => fetch(`${BASE}/demands`).then(r => r.json())
export const joinEvent = (id, token) =>
  fetch(`${BASE}/demands/${id}/join`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
```

---

## 🎨 Tasarım Sistemi

Design token'lar `src/styles/global.css` içinde CSS variables olarak tanımlandı:

```css
--amber, --amber-l, --amber-d   /* Marka renkleri */
--bg, --bg2, --bg3              /* Arka planlar */
--txt, --txt2, --txt3           /* Metin tonları */
--r, --rs, --rf                 /* Border radius */
--sh, --sh-md, --sh-amber       /* Gölgeler */
```
