# 🚀 Smart Bookmarks

A modern, real-time bookmark manager built with **Next.js (App Router)** and **Supabase**.

🔗 **Live Demo:** https://YOUR-VERCEL-URL.vercel.app  
📦 **GitHub Repo:** https://github.com/Akrambasha123/smart-bookmarks  

---

## ✨ Features

- 🔐 Google OAuth authentication (Supabase Auth only)
- 👤 Private bookmarks per user (Row Level Security enforced)
- ⚡ Real-time updates across multiple tabs
- ➕ Add bookmarks (Title + URL)
- 🗑 Delete bookmarks with confirmation modal
- 🎨 Modern SaaS-style UI (Tailwind CSS)
- 📊 Live total bookmarks counter
- 🔎 Search and sorting
- 🚀 Deployed on Vercel

---

## 🏗 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth + Postgres + Realtime) |
| Authentication | Google OAuth |
| Database | PostgreSQL (Supabase managed) |
| Hosting | Vercel |

---

## 🧠 Architecture Overview

### 🔐 Authentication
- Google OAuth handled via Supabase.
- No email/password login allowed.
- Supabase manages secure sessions and JWT.

### 🗃 Database Structure

```sql
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);
```

### 🔒 Row Level Security (RLS)

```sql
alter table bookmarks enable row level security;

create policy "Users can view own bookmarks"
on bookmarks for select
using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
on bookmarks for insert
with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
on bookmarks for delete
using (auth.uid() = user_id);
```

This ensures complete user-level isolation.

---

## ⚡ Real-Time Functionality

Supabase Realtime subscriptions listen for:
- INSERT events
- DELETE events

This ensures:
- Adding a bookmark in one tab appears instantly in another
- Deleting updates all sessions in real time

---

## 📂 Project Structure

```
src/
 ├── app/
 │   ├── (auth)/login/
 │   ├── dashboard/
 │   ├── layout.tsx
 │   └── page.tsx
 ├── components/
 ├── lib/
 │   └── supabase/
 └── types/
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 🚀 Local Setup

```bash
git clone https://github.com/Akrambasha123/smart-bookmarks.git
cd smart-bookmarks
npm install
npm run dev
```

Visit:
```
http://localhost:3000
```

---

## 🌍 Deployment

Deployed on **Vercel**.

Steps:
1. Push code to GitHub
2. Import project into Vercel
3. Add environment variables
4. Update Supabase URL Configuration
5. Deploy

---

## 🛠 Challenges Faced & Solutions

### 1️⃣ OAuth Redirect Issues  
**Problem:** Google OAuth failed due to redirect mismatch.  
**Solution:** Updated Supabase Site URL and Redirect URLs for both localhost and production.

### 2️⃣ GitHub Authentication Errors  
**Problem:** Push failed due to password authentication deprecation.  
**Solution:** Used GitHub Personal Access Token (PAT).

### 3️⃣ RLS Blocking Inserts  
**Problem:** Inserts failed due to RLS enforcement.  
**Solution:** Properly defined `auth.uid()` policies.

### 4️⃣ UI Contrast & Background Issues  
**Problem:** Background reduced readability.  
**Solution:** Redesigned UI with modern gradient and better contrast.

---

## 🔮 Future Improvements

- 🔖 Tagging / Categories
- 📤 Export bookmarks (CSV/JSON)
- 🌙 Enhanced dark mode
- 🔎 Debounced search
- 📱 Mobile UX refinement
- 🔐 Role-based permissions

---

## 📌 Why This Project Matters

This project demonstrates:

- Secure authentication flows
- Proper database isolation using RLS
- Real-time data synchronization
- Clean App Router architecture
- Production deployment workflow

---

## 👨‍💻 Author

**A Akram Basha**  
Full Stack Developer  

---

