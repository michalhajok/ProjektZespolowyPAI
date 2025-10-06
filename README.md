# Wypożyczalnia Sprzętu - Frontend

Aplikacja internetowa do obsługi wypożyczalni sprzętu zbudowana w Next.js 15 z React 19.

## 📋 Funkcjonalności

### Użytkownik

- ✅ Rejestracja i logowanie
- ✅ Przeglądanie dostępnego sprzętu
- ✅ Szczegóły sprzętu (galeria, specyfikacja, opinie)
- ✅ Rezerwacja sprzętu
- ✅ Zarządzanie własnymi rezerwacjami
- ✅ Dodawanie recenzji po zakończeniu rezerwacji

### Administrator

- ✅ Zarządzanie kategoriami (CRUD)
- ✅ Zarządzanie sprzętem (CRUD)
- ✅ Zatwierdzanie rezerwacji
- ✅ Zmiana statusów rezerwacji

## 🛠 Technologie

- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Build Tool**: Turbopack

## 🚀 Instalacja i uruchomienie

### Wymagania

- Node.js >= 18
- npm lub yarn

### Krok po kroku

1. **Klonowanie repozytorium**

```bash
git clone https://github.com/michalhajok/ProjektZespolowyPAI.git
cd ProjektZespolowyPAI
```

2. **Instalacja zależności**

```bash
npm install
```

3. **Konfiguracja środowiska**
   Utwórz plik `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:6000/api
```

4. **Uruchomienie w trybie deweloperskim**

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:80`

5. **Build produkcyjny**

```bash
npm run build
npm start
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

| Zmienna               | Opis             | Domyślna wartość            |
| --------------------- | ---------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | URL backendu API | `http://localhost:8080/api` |

### Proxy API

W `next.config.mjs` skonfiguruj przekierowania do backendu:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/api/:path*'
    }
  ];
}
```

## 📁 Struktura projektu

```
src/
├── app/                    # App Router pages
│   ├── admin/             # Panel administratora
│   │   ├── categories/    # Zarządzanie kategoriami
│   │   └── equipment/     # Zarządzanie sprzętem
│   ├── auth/              # Logowanie/rejestracja
│   ├── categories/        # Lista kategorii
│   ├── equipment/         # Lista i szczegóły sprzętu
│   └── reservations/      # Rezerwacje użytkownika
├── components/            # Komponenty wielokrotnego użytku
│   ├── Button.js         # Stylizowany przycisk
│   ├── Input.js          # Input z validacją
│   ├── Layout.js         # Główny layout
│   └── Navbar.js         # Nawigacja
├── context/              # React Context
│   └── AuthContext.js    # Kontekst uwierzytelnienia
├── hooks/                # Custom hooks
│   └── useAuth.js        # Hook uwierzytelnienia
├── lib/                  # Utilities
│   └── api.js            # Konfiguracja Axios
└── styles/               # Globalne style
```

## 🔐 Uwierzytelnienie

Aplikacja używa JWT tokenów przechowywanych w `localStorage`. Axios automatycznie dołącza token do nagłówków żądań:

```javascript
// lib/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## 🎨 Styling

Projekt używa **Tailwind CSS 4** z następującymi zasadami:

- Responsywny design (mobile-first)
- Paleta kolorów: niebieski jako główny, szary jako neutralny
- Komponenty wielokrotnego użytku z variant system
- Hover effects i animacje

### Przykład komponentu

```jsx
<Button variant="primary" size="md">
  Zarezerwuj
</Button>
```

## 📱 Responsive Design

Aplikacja jest w pełni responsywna z breakpointami:

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## 🔍 SEO i Performance

- **Metadata**: Dynamiczne title i description dla każdej strony
- **Images**: Optymalizacja obrazów z fallback placeholderami
- **Loading**: Stany ładowania dla lepszego UX
- **Error Handling**: Graceful error handling z user-friendly komunikatami

## 🚦 Role i autoryzacja

### Role użytkowników

- **user**: Standardowy użytkownik (przeglądanie, rezerwacje)
- **admin**: Administrator (zarządzanie zasobami)

### Ochrona tras

```jsx
// Przykład ochrony trasy administracyjnej
if (user?.role !== "admin") {
  return (
    <Layout>
      <p>Brak uprawnień</p>
    </Layout>
  );
}
```

## 🧪 Development

### Linting

```bash
npm run lint
```

### Struktura commitów

- `feat:` - nowa funkcjonalność
- `fix:` - poprawka błędu
- `docs:` - dokumentacja
- `style:` - stylowanie
- `refactor:` - refaktor kodu

## 🤝 Zespół

- **Jakub Mośny** - Kierownik projektu, dokumentacja, testy
- **Krystian Gwiżdż** - Frontend (UI/UX, Next.js)
- **Piotr Ćwikła** - Baza danych (modele, relacje)
- **Michał Hajok** - Backend (API, logika biznesowa)

## 📞 Wsparcie

W przypadku problemów:

1. Sprawdź logi w konsoli przeglądarki
2. Upewnij się, że backend działa na porcie 6000
3. Zweryfikuj konfigurację CORS w backendzie
4. Sprawdź poprawność tokenów JWT

---

**Politechnika Częstochowska**  
Katedra Informatyki  
Projekt zespołowy 2025/2026
