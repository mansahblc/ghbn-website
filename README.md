# GHBN — Ghana Health & Biotech Network

Official website for the Ghana Health & Biotech Network.  
**Advancing healthcare and biotechnology innovation from Ghana to Africa.**

---

## 🚀 Deploy to Vercel (Recommended — Free)

### Option A: One-Click Deploy (Easiest)

1. Go to **[vercel.com](https://vercel.com)** and sign up with your GitHub account
2. Click **"Add New Project"**
3. Click **"Upload"** and drag this entire folder
4. Vercel auto-detects it as a Vite/React project
5. Click **"Deploy"**
6. Your site is live at `your-project.vercel.app` within 60 seconds

### Option B: Deploy via GitHub

1. Create a GitHub account at **github.com** (if you don't have one)
2. Create a new repository called `ghbn-website`
3. Upload all these files to the repository
4. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
5. Click **"Import Project"** → Select your `ghbn-website` repo
6. Click **"Deploy"**

### Connect Your Domain (ghbn.org)

1. Buy your domain at **[Namecheap](https://namecheap.com)** or **[GoDaddy](https://godaddy.com)**  
   - Suggested: `ghbn.org` or `ghbn.network` (~$10-15/year)
2. In Vercel dashboard → Your project → **Settings** → **Domains**
3. Add your domain (e.g., `ghbn.org`)
4. Vercel gives you DNS records to add at your domain registrar
5. Add those records at Namecheap/GoDaddy
6. Wait 5-30 minutes → Your site is live at **ghbn.org**

---

## 💻 Run Locally (For Development)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## 📁 Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## 🔑 Admin Access

- **Admin email:** info@ghbn.org
- **Applications route to:** mansah@asedablc.com

---

## 📧 Email Setup (Later)

To create a real info@ghbn.org email:
1. After buying ghbn.org, set up email forwarding at your registrar
2. Forward info@ghbn.org → mansah@asedablc.com
3. Or use Google Workspace ($6/mo) for full email

---

## 🔒 Security Note (For Production)

This version uses localStorage for data storage, which is great for launching
and the founding cohort phase. Before scaling to hundreds of members, consider:

- Adding a backend database (Supabase is free and easy)
- Real password authentication  
- Server-side email notifications (replace mailto with API)

---

Built with ❤️ for the future of healthcare in Ghana and Africa.
