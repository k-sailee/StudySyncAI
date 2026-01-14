# StudySyncAI


A unified platform to manage classes, assignments, and AI-assisted study workflows for students.

---

## Problem Statement

Students and educators face fragmented tools for organizing classes, tracking assignments, and studying effectively. This leads to:
- Missed deadlines and scattered notes
- Time wasted switching between different apps (calendar, notes, flashcards)
- Difficulty extracting useful study material from lectures and readings

Who faces this problem?
- Students (high school, college, online learners)
- Tutors and instructors who need to manage classes and assignments
- Study groups coordinating tasks and revision

---

## Solution / Overview

StudySyncAI brings class management, task tracking, and AI study assistance into one place. It helps users create and manage classes, track assignments and due dates, and use AI tools to summarize notes, generate practice questions, and create flashcards — all from the same interface.

Core capabilities include:
- Organize classes and materials
- Track tasks, deadlines, and progress
- AI-powered note summarization, Q&A, and flashcard generation
- Notifications and simple collaboration features

---

## MVP Features (What actually works now)

- User authentication (sign up / login)
- Class management (create, edit, delete classes)
- Task/assignment tracking with due dates and status
- Basic AI assistance:
  - Summarize notes and readings
  - Generate practice questions from notes
  - Create simple flashcards
- Persisting data in the database (students' classes, tasks, AI outputs)

---

## Tech Stack

- Frontend: React , Vite , TypeScript
- Styling: Tailwind CSS 
- Backend: Node.js + Express 
- Database: Firebase Firestore 
- Authentication: Firebase Auth 
- AI: Open Router API KEY
- Hosting / Deployment: Vercel (frontend), Firebase / Render (backend)


---

## Deployment / Demo

Deployed on:
- Frontend: Vercel 
- Backend: Render

Run locally :

1. Clone the repo
   git clone https://github.com/k-sailee/StudySyncAI.git
2. Install dependencies
   - frontend: cd frontend && npm install
   - backend: cd backend && npm install
3. Start development servers
   - frontend: npm run dev
   - backend: npm run dev

---

## Environment Setup

The app requires environment variables.

- VITE_API_BASE_URL — Frontend API base URL
- FIREBASE_API_KEY — Firebase API key
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- OPENAI_API_KEY — API key for OpenAI (or other LLM provider)
- NODE_ENV — development | production

Create a .env.local (frontend) and .env (backend) with the above variables as needed.

---
