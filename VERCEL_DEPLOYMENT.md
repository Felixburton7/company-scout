# 🚀 Vercel Deployment Guide

## Required Environment Variables

Your Company Scout application requires the following environment variables to be set in Vercel:

### 1. **DATABASE_URL** (Required)
- Your SingleStore/MySQL database connection string
- Format: `mysql://user:password@host:port/database`
- Example: `mysql://admin:password123@svc-xyz.svc.singlestore.com:3306/company_scout`

### 2. **GROQ_API_KEY** (Required)
- Your Groq API key for AI processing
- Get it from: https://console.groq.com/keys
- Format: `gsk_...`

### 3. **TRIGGER_DEV_SECRET_KEY** (Required for background jobs)
- Your Trigger.dev secret key
- Get it from: https://cloud.trigger.dev → Your Project → API Keys
- Format: `tr_prod_...` or `tr_dev_...`

---

## How to Add Environment Variables to Vercel

1. Go to your **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your **Company Scout** project
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your database connection string
   - **Environments**: Production, Preview, Development (check all)
   - Click **Save**
5. Repeat for `GROQ_API_KEY` and `TRIGGER_DEV_SECRET_KEY`

---

## Redeploy After Adding Variables

After adding all environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **...** (three dots) menu
4. Select **Redeploy**
5. Check "Use existing Build Cache" if available
6. Click **Redeploy**

**OR** simply push a new commit to trigger automatic redeployment.

---

## Troubleshooting

### Still getting 404 errors?

1. **Check build logs** in Vercel:
   - Deployments → Click on deployment → View Function Logs
   - Look for errors mentioning missing environment variables

2. **Verify environment variables are set**:
   - Settings → Environment Variables
   - Make sure all three variables are present

3. **Check database accessibility**:
   - Your SingleStore database must be accessible from Vercel's servers
   - Whitelist Vercel's IP ranges if needed: https://vercel.com/docs/security/deployments/ip-addresses

4. **Verify API keys are valid**:
   - Test your GROQ_API_KEY at https://console.groq.com
   - Test your TRIGGER_DEV_SECRET_KEY at https://cloud.trigger.dev

### Common Issues

**Error: "DATABASE_URL environment variable is not set!"**
- Solution: Add `DATABASE_URL` to Vercel environment variables

**Error: "GROQ_API_KEY environment variable is not set!"**
- Solution: Add `GROQ_API_KEY` to Vercel environment variables

**Error: Connection timeout to database**
- Solution: Check if your database firewall allows connections from Vercel
- SingleStore: Add Vercel IPs to allowed list

---

## Local Development

For local development, create a `.env` file in the root directory:

```bash
DATABASE_URL="mysql://user:password@host:port/database"
GROQ_API_KEY="gsk_..."
TRIGGER_DEV_SECRET_KEY="tr_dev_..."
```

**Never commit this file to Git!** (It's already in `.gitignore`)

---

## Next Steps

Once environment variables are configured:

1. ✅ Redeploy on Vercel
2. ✅ Visit your deployed URL
3. ✅ Test the company analysis feature
4. ✅ Check Vercel function logs for any errors

Need help? Check the [Vercel documentation](https://vercel.com/docs) or contact support.
