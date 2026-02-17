# smart-bookmarks

Private bookmark manager built with Next.js + Supabase.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure env in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the SQL in `supabase/realtime_setup.sql` in Supabase SQL Editor.

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Realtime bookmark sync

After applying `supabase/realtime_setup.sql`, bookmark changes are synced automatically across open tabs and devices for the same signed-in user.

Checklist:

- `bookmarks` table exists
- Row Level Security is enabled
- select/insert/update/delete policies exist for own rows
- `bookmarks` is added to `supabase_realtime` publication
- `replica identity full` is set for correct DELETE realtime behavior
