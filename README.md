# LingoLab - English Learning Platform

A modern English learning application built with React, Vite, and Vercel Serverless Functions.

## Features

- **Phonetics Learning**: Interactive IPA chart with TTS.
- **Word Learning**: Flashcards with spaced repetition concepts (mock logic).
- **Sentence Learning**: Practice sentences with speech synthesis.
- **Pronunciation Assessment**: Real-time speech scoring using Web Speech API.
- **Teacher Dashboard**: Admin interface to manage words and sentences.

## Tech Stack

- **Frontend**: React, Vite, Tailwind-like CSS variables (Vanilla CSS).
- **Backend**: Node.js, Vercel Serverless Functions (`/api`).
- **Database**: PostgreSQL (via Prisma).

## Setup & Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database**
   Copy `.env.example` to `.env` and update `DATABASE_URL` with your PostgreSQL connection string.
   
   *Note: If you are using Neon DB, ensure your request location is allowed or valid.*

   ```bash
   # Push schema to database
   npx prisma db push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

## Deployment

### Vercel
1. Install Vercel CLI or connect your GitHub repository to Vercel.
2. Add `DATABASE_URL` to Vercel Environment Variables.
3. Deploy!

### Directory Structure
- `src/` - Frontend React application.
- `api/` - Backend API functions.
- `prisma/` - Database schema.
- `public/` - Static assets.

## Troubleshooting

- **Database Connection**: If you see "Can't reach database", ensure your firewall/network allows connection to the database port (5432) and that the database URL is correct.
