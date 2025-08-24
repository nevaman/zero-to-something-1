# Quick Setup Guide

## 1. Environment Configuration

Create a `.env` file in the root directory with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Public Site Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Update Public Site Configuration

Edit `public-site.html` and replace these lines with your actual Supabase credentials:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Admin Panel

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

## 5. Open Public Site

Open `public-site.html` in your browser to see the dynamic public site.

## 6. First Login

1. Go to `http://localhost:3000`
2. Click "Sign Up" to create your first admin account
3. Verify your email
4. Log in and start editing content!

## 7. Deploy

- **Admin Panel**: Deploy to Vercel/Netlify
- **Public Site**: Deploy to any static hosting (Netlify, Vercel, GitHub Pages)
- **Database**: Supabase handles this automatically
