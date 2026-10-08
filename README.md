# Henry Cobbinah - Portfolio

A modern, high-performance developer portfolio built with React 19, TypeScript, Vite, Tailwind CSS, Three.js, and Framer Motion. 

This repository is a **100% standalone, frontend-only static web application**. It requires no backend server, no database, and can be hosted completely free on Vercel, Netlify, or GitHub Pages.

---

## ⚡ Tech Stack & Features

* **Framework**: React 19 + TypeScript + Vite
* **3D Visuals**: Three.js (`three` + `@types/three`)
* **Animations**: Framer Motion
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Contact Form**: Web3Forms (serverless email delivery to `henricobb2@gmail.com`) with automatic `mailto:` fallback
* **Design Standards**: `taste-skill` suite for anti-slop typography, responsive layouts, and fluid motion

---

## 📁 Project Structure

```
portfolio/
├── components/          # Reusable UI sections & cards
│   ├── Navbar.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section with portrait & social links
│   ├── About.tsx        # Bio & core pillars
│   ├── Experience.tsx   # Industry internships & career timeline
│   ├── Skills.tsx       # Tech proficiencies with icon badges
│   ├── Projects.tsx     # Project showcase with GitHub/Demo links
│   ├── Contact.tsx      # Serverless contact form
│   ├── Footer.tsx       # Footer links & copyright
│   └── Background.tsx   # Ambient animated visual background
├── public/              # Static assets (technology icons)
├── constants.ts         # Centralized type-safe portfolio data
├── types.ts             # TypeScript interface definitions
├── henry.jpg            # Profile portrait image
├── App.tsx              # Root application layout
├── index.html           # HTML entrypoint
└── package.json         # Dependencies & scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js** (v18+)
* **NPM**

### Installation

```bash
# Clone the repository
git clone https://github.com/hendrix-llouchi/my-portfolio-monorepo.git

# Enter the project directory
cd my-portfolio-monorepo

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Build for Production

```bash
npm run build
```

The optimized, production-ready static assets will be compiled into the `dist/` directory.

---

## 📬 Contact Form Configuration (Optional)

The contact form is configured to work out-of-the-box using direct email fallback. 

To enable silent, seamless in-page submissions without opening a mail client:
1. Get a free access key at [https://web3forms.com](https://web3forms.com) (enter `henricobb2@gmail.com`).
2. Create a `.env` file in the root directory:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

---

## 🚢 Deployment

Deploy in one click to any modern static host:

### Vercel / Netlify
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
