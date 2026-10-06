# Hendrix's Portfolio

A modern, high-performance portfolio website built with React 19, TypeScript, Vite, Tailwind CSS, Three.js, and Framer Motion.

> **📢 Architecture Notice: Transitioning to Frontend-Only (Static / Jamstack)**  
> This project is shifting from a multi-service fullstack monorepo to a **100% standalone, frontend-only architecture**.  
> **Why?**
> * **$0 Hosting Costs Forever**: Effortless deployment to Vercel, Netlify, or GitHub Pages.
> * **Zero Cold Starts**: No waiting 30–60 seconds for free-tier backend containers (e.g., Render/Railway) to spin up.
> * **Zero Maintenance**: Eliminates PHP/Composer version lock-in, database migrations, CORS issues, and queue worker processes.
> * **Instant Performance**: Static data served instantly over global edge CDNs.

---

## 🏗️ Repository Structure

```
my-portfolio-monorepo/
├── portfolio-frontend/       # 🌟 [PRIMARY] Standalone React 19 Showcase Portfolio
│   ├── React 19, TypeScript, Vite
│   ├── Three.js 3D graphics & animations
│   ├── Framer Motion & Tailwind CSS
│   └── Static type-safe data (constants.ts)
│
├── admin-panel/              # 📦 [OPTIONAL / LEGACY] Admin CMS Dashboard
│   ├── React 18, React Router v7, Axios
│   └── (Used only with the fullstack Laravel backend)
│
└── PortfolioBackend/         # 📦 [OPTIONAL / LEGACY] Laravel 12 REST API
    ├── PHP 8.2+, Laravel Sanctum, SQLite / MySQL
    └── (Archived for fullstack reference or future API needs)
```

---

## ⚡ Tech Stack

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **Core Framework** | React 19, TypeScript, Vite | Fast, modern client runtime with strict typing. |
| **3D & Visuals** | Three.js (`three`), WebGL | 3D interactive canvas and background animations. |
| **Animation** | Framer Motion / Motion | Fluid physics-based transitions, hover cards, and scroll reveals. |
| **Styling & Icons** | Tailwind CSS, Lucide React | Utility-first styling with responsive design tokens. |
| **Design Standards**| `taste-skill` suite | Anti-slop engineering, typography discipline, and asymmetric layouts. |
| **Form Handling** | Serverless (Web3Forms / EmailJS) | Direct email delivery without requiring a dedicated backend server. |

---

## 🚀 Frontend-Only Migration Roadmap

We are actively rolling out the following enhancements:

### 1. 🔄 Standalone Data & Contact Form Decoupling
- [ ] **Static Data Integration**: Power [`Projects.tsx`](portfolio-frontend/components/Projects.tsx), [`Experience.tsx`](portfolio-frontend/components/Experience.tsx), and [`Skills.tsx`](portfolio-frontend/components/Skills.tsx) directly from type-safe [`constants.ts`](portfolio-frontend/constants.ts) without relying on backend API calls.
- [ ] **Serverless Contact Form**: Replace the Laravel `/api/contact` endpoint with **Web3Forms** or **EmailJS** to send messages directly to inbox with zero server dependencies.

### 2. 🌌 Three.js Interactive 3D Visuals
- [ ] **3D Interactive Canvas**: Integrate interactive Three.js 3D particle fields or floating geometric wireframes responsive to mouse movement and scroll.
- [ ] **Performance Polish**: Ensure hardware-accelerated 60fps rendering with smooth fallback on low-power and mobile devices.

### 3. 🎨 Taste-Skill UI/UX Elevation
- [ ] **Bento Grid Showcase**: Modernize the projects layout into an asymmetric bento grid.
- [ ] **Display Typography**: Implement curated sans-serif pairings (Geist / Satoshi) with fluid responsive scaling.
- [ ] **Micro-Interactions**: Add magnetic hover effects, glassmorphic accents, and animated state transitions.

### 4. 📱 Mobile & Accessibility (a11y)
- [ ] **Mobile Stability**: Adopt `min-h-[100dvh]` to eliminate mobile address-bar resize jumps.
- [ ] **Accessibility Compliance**: Support `prefers-reduced-motion` and strict color contrast guidelines.

---

## 💻 Quickstart (Frontend-Only)

To run the portfolio locally:

```bash
# Navigate to the frontend directory
cd portfolio-frontend

# Install dependencies (includes Three.js and Framer Motion)
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🚢 Production Deployment

Because the project is standalone frontend, you can deploy in one command or connect directly to **Vercel** or **Netlify**:

* **Root Directory**: `portfolio-frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`

---

## 📦 Legacy Fullstack Modules (Optional)

If you wish to experiment with or run the original Laravel API and Admin CMS panel:

* **Backend**: See [PortfolioBackend/README.md](PortfolioBackend/README.md) (`php artisan serve`)
* **Admin Panel**: See [admin-panel/README.md](admin-panel/README.md) (`npm run dev`)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
