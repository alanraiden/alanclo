# Alan Sarang M A — Portfolio

Personal portfolio website built with **Next.js 14** + **TypeScript**, ready to deploy on **Vercel** in one click.

## 🚀 Deploy to Vercel (3 steps)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Click **Deploy** — Vercel auto-detects Next.js, no config needed

## 🛠 Run locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 🎮 Game Center

Upload `.js`, `.ts`, or `.tsx` game files — TypeScript types are stripped automatically in the browser so pure canvas/DOM games run natively.

> **Note:** Games that depend on npm packages (React, Phaser, Three.js) won't run in the sandbox, but plain canvas games work great.

## ✏️ Customise

All personal data (skills, projects, blog posts) is in `src/app/page.tsx` at the top — just edit the `SKILLS`, `PROJECTS`, and `BLOGS` arrays.
