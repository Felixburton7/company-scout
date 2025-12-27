# Vercel Production Configuration Checklist

## ✅ Current Status
- Production Trigger.dev ID: `tr_prod_Adp6bJsnCiLatlOoA1y9`
- Project ID in trigger.config.ts: `proj_amoougeubbocksquqycw`

## 🔧 Required Vercel Environment Variables

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### 1. TRIGGER_DEV_SECRET_KEY
- **Value**: `tr_prod_Adp6bJsnCiLatlOoA1y9`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Purpose**: Connects your app to Trigger.dev production environment

### 2. DATABASE_URL
- **Value**: Your SingleStore/MySQL connection string
- **Format**: `mysql://user:password@host:port/database`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 3. GOOGLE_GENERATIVE_AI_API_KEY
- **Value**: Your Google Gemini API key
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 4. GROQ_API_KEY (if using Groq)
- **Value**: Your Groq API key
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

## 🔍 Verification Steps

### Step 1: Check Environment Variables in Vercel
```bash
# Visit your deployed app at:
https://company-scout.vercel.app/api/env-check

# This should return:
{
  "status": "OK",
  "environment": {
    "DATABASE_URL": true,
    "GROQ_API_KEY": true,
    "TRIGGER_DEV_SECRET_KEY": true,
    "NODE_ENV": "production",
    "VERCEL": true,
    "VERCEL_ENV": "production"
  }
}
```

### Step 2: Verify Trigger.dev Connection
1. Go to https://cloud.trigger.dev
2. Navigate to your project: `company-scout-db-2`
3. Check the **Production** environment
4. Look for recent task runs after deploying

### Step 3: Test the Application
1. Visit https://company-scout.vercel.app
2. Enter a company domain (e.g., `stripe.com`)
3. Click "Analyze Company"
4. Check Trigger.dev dashboard for the task execution

## 🚀 Deployment Steps

### After Updating next.config.ts:

1. **Commit and push changes**:
```bash
git add next.config.ts
git commit -m "Fix: Map TRIGGER_DEV_SECRET_KEY to TRIGGER_SECRET_KEY for production"
git push
```

2. **Vercel will auto-deploy** (or manually trigger):
   - Go to Vercel dashboard
   - Click "Redeploy" if needed

3. **Verify the deployment**:
   - Check build logs for errors
   - Visit `/api/env-check` endpoint
   - Test company analysis

## 🐛 Troubleshooting

### Issue: Tasks not appearing in Trigger.dev production
**Cause**: Wrong secret key or environment variable not mapped

**Solution**:
1. Verify `TRIGGER_DEV_SECRET_KEY` in Vercel = `tr_prod_Adp6bJsnCiLatlOoA1y9`
2. Ensure `next.config.ts` has the env mapping (already done ✅)
3. Redeploy the application

### Issue: "TRIGGER_SECRET_KEY not found" error
**Cause**: Environment variable not set in Vercel

**Solution**:
1. Add `TRIGGER_DEV_SECRET_KEY` to Vercel environment variables
2. Set it for Production, Preview, and Development
3. Redeploy

### Issue: Tasks running in development instead of production
**Cause**: Using development key in production

**Solution**:
1. Double-check the key starts with `tr_prod_` not `tr_dev_`
2. Verify in Trigger.dev dashboard which environment is receiving tasks

## 📊 How to Verify It's Working

### In Trigger.dev Dashboard:
1. Go to https://cloud.trigger.dev/orgs/personal-5e2d/projects/company-scout-db-2/env/prod
2. You should see:
   - Environment: **Production** (not Development)
   - Recent runs appearing after testing
   - Task ID: `research-company`

### In Your Application:
1. Analyze a company
2. Check the database for the record
3. Wait for completion
4. Results should appear in the UI

## 🔐 Security Notes

- Never commit `.env` files to git (already in .gitignore ✅)
- Production keys should only be in Vercel environment variables
- Development keys should only be in local `.env` file

## ✅ Final Checklist

- [ ] `TRIGGER_DEV_SECRET_KEY` set in Vercel to `tr_prod_Adp6bJsnCiLatlOoA1y9`
- [ ] All other environment variables set in Vercel
- [ ] `next.config.ts` updated with env mapping
- [ ] Code committed and pushed to git
- [ ] Vercel deployment successful
- [ ] `/api/env-check` returns all variables as `true`
- [ ] Test company analysis works
- [ ] Tasks appear in Trigger.dev **Production** environment

---

## 🎯 Quick Test Command

After deployment, run this to verify:

```bash
curl https://company-scout.vercel.app/api/env-check
```

Expected output:
```json
{
  "status": "OK",
  "environment": {
    "DATABASE_URL": true,
    "GROQ_API_KEY": true,
    "TRIGGER_DEV_SECRET_KEY": true,
    "VERCEL_ENV": "production"
  }
}
```
