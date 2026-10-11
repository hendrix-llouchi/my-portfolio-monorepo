# Henry Cobbinah — Portfolio

A light, editorial developer portfolio. Cream canvas, oversized Bodoni Moda serif type, thin rules, generous whitespace — built as a 100% standalone frontend with no backend, no database, and no build-time image pipeline.

**Live:** https://henry-cobbinah.vercel.app

---

## Design

- **Canvas:** warm cream (`#f4efe4`), ink text (`#161513`)
- **Type:** Bodoni Moda (display serif) + Inter (body/labels)
- **Sections:** Hero → About → Experience → Selected Work → Contact
- **Details:** rotating "AVAILABLE FOR PROJECTS" badge (letters individually positioned around the ring for consistent rendering across browsers), black-and-white portrait, Framer Motion scroll reveals, thin divider rules
- **No Tailwind CDN, no Three.js** — hand-written CSS in `index.css`

## Tech stack

- React 19 + TypeScript + Vite
- Framer Motion (reveals), Lucide React (icons)
- Contact form: Web3Forms when a `VITE_WEB3FORMS_ACCESS_KEY` is set, otherwise `mailto:` fallback to `henricobb2@gmail.com`

## Project structure

```
├── App.tsx          # All five sections + badge, nav, footer
├── index.css        # Editorial design system (no framework)
├── index.html       # Entry — Google Fonts (Bodoni Moda + Inter)
├── constants.ts     # Portfolio data: experience, projects, socials
├── types.ts         # TypeScript interfaces
├── photo.ts         # Hero portrait (B&W, embedded as base64)
├── index.tsx        # React root
└── vite.config.ts   # Vite config
```

## Selected work

1. **FarmLink** — https://github.com/hendrix-llouchi/FarmLink
2. **Valkyrie** — https://github.com/hendrix-llouchi/Valkyire
3. **VisionLM** — https://github.com/hendrix-llouchi/Vision-LM
4. **voltsnbits** — https://github.com/hendrix-llouchi/voltsnbits

## Experience

Roles-only ledger (latest first): Npontu Technologies Limited (Full Stack Developer), AngloGold Ashanti Iduapriem Mine (Backend Developer), Excelerate (AI Forensic Advisory), Go2Cod (Data Science), ERA AXIS (LinkedIn Optimization & Research Intern).

---

## Getting started locally

Prerequisites: Node.js v18+, npm.

```bash
git clone https://github.com/hendrix-llouchi/my-portfolio-monorepo.git
cd my-portfolio-monorepo
npm install
npm run dev
```

Open http://localhost:5173.

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Contact form (optional)

Out of the box the form falls back to opening the visitor's mail client. For silent in-page submissions, get a free key at https://web3forms.com and set it as a Vercel environment variable (or local `.env`):

```env
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

## Deployment

Hosted on Vercel (auto-deploys from `main`):

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

## License

MIT.
