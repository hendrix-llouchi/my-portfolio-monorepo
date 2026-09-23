# Hendrix's Portfolio Monorepo

A modern, high-performance portfolio ecosystem structured as a decoupled monorepo. It features a public-facing client portfolio with 3D animations, an administrative CMS panel for real-time content management, and a robust Laravel REST API backend.

---

## 🏗️ Architecture & Project Structure

```
my-portfolio-monorepo/
├── portfolio-frontend/       # Public-facing showcase portfolio
│   ├── React 19, TypeScript, Vite
│   ├── Three.js, Framer Motion
│   └── Tailwind CSS
│
├── admin-panel/              # CMS Dashboard to manage site content
│   ├── React 18, TypeScript, Vite
│   ├── React Router v7, Axios
│   └── Tailwind CSS
│
└── PortfolioBackend/         # RESTful API & Persistence Layer
    ├── Laravel 12 (PHP 8.2+)
    ├── Laravel Sanctum (Token Auth)
    └── SQLite / MySQL with async queue workers
```

---

## ⚡ Tech Stack & Highlights

| Service | Technologies | Description |
| :--- | :--- | :--- |
| **`portfolio-frontend`** | React 19, TypeScript, Three.js, Framer Motion, Tailwind CSS, Lucide | Dynamic portfolio showcasing projects, skills, timeline, and contact form with fluid animations. |
| **`admin-panel`** | React 18, TypeScript, React Router v7, Axios, Tailwind CSS | Content management dashboard for managing projects, skills, experience, inbound messages, and team members. |
| **`PortfolioBackend`** | Laravel 12, PHP 8.2+, Laravel Sanctum, SQLite / MySQL | Secure REST API handling authentication, CRUD operations, rate-limited contact submissions, and email notifications. |
| **Design Engine** | `taste-skill` suite & `three` | Anti-slop frontend engineering, calibrated motion, typography discipline, and 3D visual effects. |

---

## 🚀 Upcoming Implementations & Roadmap

We are actively developing and upgrading the portfolio with the following features:

### 1. 🌌 Three.js Interactive 3D Visuals
- [ ] **3D Interactive Hero Canvas**: Integrate custom Three.js interactive 3D particle systems or generative geometric mesh reacting to cursor motion and scroll.
- [ ] **Depth & Particle Background**: Upgrade the current background with responsive WebGL shaders and smooth physics while preserving 60fps performance on mobile.

### 2. 🎨 Taste-Skill UI/UX Elevation
- [ ] **Bento Grid Layouts**: Refactor the projects and skills sections into asymmetric, modern bento grids.
- [ ] **Kinetic Typography & Spacing**: Calibrate typography scale (display sans pairings, optimal reading width, fluid responsive sizing).
- [ ] **Smooth Scroll & Micro-Interactions**: Implement physics-based hover cards, magnetic buttons, and scroll-linked progress reveals.

### 3. 🔄 Seamless Real-Time Content Sync
- [ ] Connect public frontend fully with backend endpoints (`/api/projects`, `/api/skills`, `/api/experiences`, `/api/profile`) with fallback states for offline resilience.
- [ ] Enhanced media handling for project screenshots and demo previews.

### 4. 🛠️ Admin CMS Enhancements
- [ ] Drag-and-drop media uploader for project gallery images.
- [ ] In-line status badges and instant live-preview modal before publishing changes.
- [ ] Message threading, status filtering (unread/read/replied), and quick reply via email.

### 5. 📱 Performance & Accessibility (a11y)
- [ ] Mobile touch optimizations and viewport height stability (`min-h-[100dvh]`).
- [ ] Support for `prefers-reduced-motion` and `prefers-reduced-transparency`.
- [ ] Dark/Light mode theme transitions with persistent user preference.

---

## 💻 Local Setup & Development

### Prerequisites
* **Node.js** (v18+ or v24+)
* **PHP** (8.2+)
* **Composer** (v2+)

---

### 1. Backend Setup (`PortfolioBackend`)

```bash
cd PortfolioBackend

# Install PHP and frontend asset dependencies
composer install
npm install

# Setup environment variables & generate application key
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Start Laravel development server & queue worker
php artisan serve
php artisan queue:listen --tries=1
```
> The API will be available at `http://127.0.0.1:8000`.

---

### 2. Public Frontend Setup (`portfolio-frontend`)

```bash
cd portfolio-frontend

# Install dependencies (includes Three.js and Framer Motion)
npm install

# Start Vite development server
npm run dev
```
> The frontend will be available at `http://localhost:5173`.

---

### 3. Admin Panel Setup (`admin-panel`)

```bash
cd admin-panel

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
> The admin panel will be available at `http://localhost:5174`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Public | Fetch user profile, bio, and avatar |
| `GET` | `/api/projects` | Public | List published portfolio projects |
| `GET` | `/api/skills` | Public | List skills and categories |
| `GET` | `/api/experiences` | Public | List career and education timeline |
| `POST` | `/api/contact` | Public (Throttled) | Submit message from contact form |
| `POST` | `/api/login` | Public | Admin login & Sanctum token generation |
| `POST` | `/api/logout` | Protected | Invalidate current session token |
| `POST/PUT/DELETE` | `/api/projects` | Protected | CRUD operations for projects |
| `POST/PUT/DELETE` | `/api/skills` | Protected | CRUD operations for skills |
| `POST/PUT/DELETE` | `/api/experiences` | Protected | CRUD operations for experiences |
| `GET/DELETE` | `/api/messages` | Protected | View and manage contact submissions |
| `GET/POST/PUT/DELETE`| `/api/users` | Protected | Manage admin users |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
