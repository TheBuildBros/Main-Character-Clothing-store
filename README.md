# Full-Stack Clothing Store Project

A full-stack e-commerce clothing store application with Next.js, Express.js, TypeScript, and Supabase.

---

## Project Structure

```text
├── frontend/    # Next.js App Router, TypeScript, Tailwind CSS, 3D (Three.js/Fiber/Drei), GSAP, Lenis, Zustand, TanStack Query, Shadcn UI
├── backend/     # Express.js REST API with TypeScript, Helmet, CORS, Zod, and Supabase client
├── supabase/    # Supabase local configuration and migrations
└── README.md    # Project documentation and setup guide
```

---

## Getting Started

### 1. Installation

Install dependencies for both frontend and backend:

```bash
# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd ../backend && npm install
```

---

### 2. Environment Configuration

Copy the example environment files and populate them with your Supabase credentials:

#### Frontend (`frontend/.env.local`):
```bash
cp frontend/.env.local.example frontend/.env.local
```
Update `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### Backend (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```
Update `backend/.env`:
```env
PORT=4000
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
FRONTEND_URL=http://localhost:3000
```

> **Note:** Never commit `.env` or `.env.local` files to version control.

---

### 3. Supabase Database

The local Supabase configuration is initialized in `supabase/config.toml` with an empty `supabase/migrations/` directory ready for schema migrations.

When you are ready to link a remote Supabase project:
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
```

---

### 4. Running the Development Servers

Open two terminal windows:

#### Start Backend:
```bash
cd backend
npm run dev
```
Backend API will run at: **http://localhost:4000**  
Health check route: `GET http://localhost:4000/health`

#### Start Frontend:
```bash
cd frontend
npm run dev
```
Frontend web app will run at: **http://localhost:3000**

---

### 5. Production Build Verification

To verify production builds:

```bash
# Frontend build
cd frontend && npm run build

# Backend build
cd ../backend && npm run build
```
