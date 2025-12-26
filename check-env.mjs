#!/usr/bin/env node

/**
 * Environment Variable Checker
 * Run this to verify your environment variables are set correctly
 */

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = [
    { name: 'DATABASE_URL', required: true, description: 'SingleStore/MySQL connection string' },
    { name: 'GROQ_API_KEY', required: true, description: 'Groq API key for AI processing' },
    { name: 'TRIGGER_DEV_SECRET_KEY', required: false, description: 'Trigger.dev secret key (for production)' },
];

let allGood = true;

for (const varInfo of requiredVars) {
    const value = process.env[varInfo.name];
    const isSet = !!value;
    const icon = isSet ? '✅' : (varInfo.required ? '❌' : '⚠️');

    console.log(`${icon} ${varInfo.name}`);
    console.log(`   ${varInfo.description}`);

    if (isSet) {
        // Show first 10 chars to verify it's actually set
        const preview = value.substring(0, 10) + '...';
        console.log(`   Value: ${preview} (${value.length} chars)`);
    } else {
        console.log(`   Status: NOT SET`);
        if (varInfo.required) {
            allGood = false;
        }
    }
    console.log('');
}

console.log('═'.repeat(60));

if (allGood) {
    console.log('✅ All required environment variables are set!');
    console.log('\nYou can now run:');
    console.log('  npm run dev    - Start development server');
    console.log('  npm run build  - Build for production');
} else {
    console.log('❌ Some required environment variables are missing!');
    console.log('\nTo fix this:');
    console.log('1. Create a .env file in the project root');
    console.log('2. Add the missing variables (see .env.example)');
    console.log('3. For Vercel: Add them in Settings → Environment Variables');
    process.exit(1);
}

console.log('═'.repeat(60));
