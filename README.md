# MySharpJobs

MySharpJobs is a modern platform connecting skilled artisans with clients for localized services across Nigeria. The platform features real-time geotracking, advanced job management, secure payments, and comprehensive dashboards for clients, artisans, and administrators.

---

## 🚀 Features

- **Role-based Dashboards:**  
  - Client, Artisan, and Admin dashboards with enhanced analytics and management tools.
- **Geotracking & Map Search:**  
  - Real-time location tracking for jobs and artisans.
  - Interactive map search with advanced filters.
- **Job Management:**  
  - Post, track, and manage jobs with status updates and progress photos.
- **Secure Payments:**  
  - Escrow-based payment system with Paystack integration (demo).
- **Messaging & Notifications:**  
  - In-app messaging and notification center for all users.
- **User Verification:**  
  - Document upload and verification workflow for artisans.
- **Admin Oversight:**  
  - Comprehensive admin dashboard for platform analytics, dispute resolution, and user management.
- **Responsive UI:**  
  - Mobile-first, accessible, and visually appealing design using Tailwind CSS and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Routing:** React Router v6
- **State Management:** React Context API
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Maps:** React Leaflet + Leaflet
- **Build Tool:** Vite

---

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mysharpjobs.git
   cd mysharpjobs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in your browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## 👤 Demo Accounts

- **Client:** `client@demo.com` (any password)
- **Artisan:** `artisan@demo.com` (any password)
- **Admin:** `admin@demo.com` (any password)

---

## 🗺️ Main Routes

| Role    | Dashboard URL                       |
|---------|-------------------------------------|
| Client  | `/client/dashboard/enhanced`        |
| Artisan | `/artisan/dashboard/enhanced`       |
| Admin   | `/admin/dashboard/enhanced`         |

- **Map Search:** `/search/enhanced`
- **Notifications:** `/notifications`
- **Messages:** `/messages`
- **Job Details:** `/job/:id`
- **Payment:** `/payment/:id`

---

## 📂 Project Structure

```
src/
  components/         # Reusable UI components
  context/            # Auth and global context providers
  data/               # Mock data and helper functions
  pages/              # Page components (dashboard, search, etc.)
  App.tsx             # Main app and routing
  index.tsx           # Entry point
public/
  index.html
tailwind.config.js
vite.config.ts
...
```

---

## 🧑‍💻 Development Notes

- **Authentication:**  
  Uses a mock context-based authentication system for demo purposes.
- **Data:**  
  All data is mock/in-memory for MVP and demo. No backend required.
- **Geotracking:**  
  Map and location features use React Leaflet and browser geolocation APIs.
- **Accessibility:**  
  ARIA labels, keyboard navigation, and color contrast are considered.

---

## 📖 Documentation

- [GEOTRACKING_INTEGRATION_COMPLETE.md](./GEOTRACKING_INTEGRATION_COMPLETE.md)
- [ADMIN_DASHBOARD_ANALYSIS.md](./ADMIN_DASHBOARD_ANALYSIS.md)
- [ADMIN_DASHBOARD_ACCESS.md](./ADMIN_DASHBOARD_ACCESS.md)
- [UI_UX_ENHANCEMENT_SUMMARY.md](./UI_UX_ENHANCEMENT_SUMMARY.md)

---

## 📝 License

This project is for demonstration and educational purposes only.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Magic Patterns](https://magicpatterns.com) (initial code generation)

---

