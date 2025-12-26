# 🚨 URGENT: Fix Vercel 404 Error

## The Problem
Your Vercel deployment is showing a 404 NOT_FOUND error because **environment variables are not set on Vercel**.

Your `.env` file exists locally, but Vercel cannot access it (it's gitignored for security).

## The Solution

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Find and click on your **company-scout** project

### Step 2: Add Environment Variables
1. Click **Settings** (in the navigation)
2. Click **Environment Variables** (in the left sidebar)
3. Add the following variables **one by one**:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Copy from your local `.env` file (line starting with `DATABASE_URL=`)
- **Environments**: Check ✅ **Production**, **Preview**, and **Development**
- Click **Save**

#### Variable 2: GROQ_API_KEY
- **Key**: `GROQ_API_KEY`
- **Value**: Copy from your local `.env` file (line starting with `GROQ_API_KEY=`)
- **Environments**: Check ✅ **Production**, **Preview**, and **Development**
- Click **Save**

#### Variable 3: TRIGGER_SECRET_KEY
- **Key**: `TRIGGER_DEV_SECRET_KEY` ⚠️ Note: Name is different on Vercel!
- **Value**: Copy from your local `.env` file (line starting with `TRIGGER_SECRET_KEY=`)
- **Environments**: Check ✅ **Production**, **Preview**, and **Development**
- Click **Save**

#### Variable 4: GEMINI_API_KEY (if using Gemini)
- **Key**: `GEMINI_API_KEY`
- **Value**: Copy from your local `.env` file
- **Environments**: Check ✅ all three
- Click **Save**

### Step 3: Redeploy
After adding ALL variables:

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Click the **...** (three dots) on your latest deployment  
3. Select **Redeploy**
4. Click **Redeploy** to confirm

**Option B: Push a Commit** (Easier)
```bash
# Make a small change and push
git add .
git commit -m "Add environment variable validation"
git push
```

### Step 4: Verify
Once redeployed:
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Visit: `https://your-app.vercel.app/api/env-check`
   - Should show: `"status": "OK"`
3. Test the homepage - should load without 404!

---

## Why This Happened

**Local Development:**
- Next.js automatically reads `.env` file
- Your app works perfectly

**Vercel (Production):**
- Cannot access `.env` (it's in `.gitignore` - never pushed to Git)
- Environment variables must be manually configured in Vercel dashboard
- Without them, app crashes → Vercel shows 404

**The 404 is misleading:**
- It's not a missing page
- It's the app **failing to start** due to missing DATABASE_URL
- Vercel returns 404 as a generic "something went wrong" response

---

## Quick Checklist

- [ ] Open Vercel Dashboard
- [ ] Go to your project → Settings → Environment Variables
- [ ] Add `DATABASE_URL` (copy from local .env)
- [ ] Add `GROQ_API_KEY` (copy from local .env)
- [ ] Add `TRIGGER_DEV_SECRET_KEY` (copy from local TRIGGER_SECRET_KEY)
- [ ] Add `GEMINI_API_KEY` if using (copy from local .env)
- [ ] Check all three environments for each variable
- [ ] Redeploy from Deployments tab OR push a commit
- [ ] Visit `/api/env-check` to verify
- [ ] Test homepage

---

## Still Not Working?

If you still get 404 after adding variables and redeploying:

1. **Check Vercel Function Logs:**
   - Deployments → Click deployment → Runtime Logs
   - Look for actual error messages

2. **Verify database accessibility:**
   - Your SingleStore DB must allow connections from Vercel IPs
   - Check SingleStore firewall settings

3. **Test the env-check endpoint:**
   - Visit: `https://your-deployed-url.vercel.app/api/env-check`
   - Should return JSON with status "OK"

## Need the actual values from .env?

Run this command locally to see your env vars (safe - shows first chars only):
```bash
node check-env.mjs
```

Or to copy them one by one:
```bash
cat .env
```

Then manually copy each value to Vercel dashboard.
