#!/usr/bin/env node

/**
 * Show environment variables for Vercel setup
 * This will display your env vars in a format ready to copy to Vercel
 */

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('📋 Environment Variables for Vercel\n');
console.log('═'.repeat(70));
console.log('Copy these to Vercel → Settings → Environment Variables');
console.log('═'.repeat(70));
console.log('');

try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

    const mapping = {
        'TRIGGER_SECRET_KEY': 'TRIGGER_DEV_SECRET_KEY'  // Vercel uses different name
    };

    for (const line of lines) {
        if (line.includes('=')) {
            let [key, ...valueParts] = line.split('=');
            const value = valueParts.join('='); // Handle values with = in them

            // Map to Vercel name if needed
            const vercelKey = mapping[key] || key;

            console.log(`┌─ Variable ${lines.indexOf(line) + 1}`);
            console.log(`│  Key: ${vercelKey}`);
            console.log(`│  Value: ${value}`);
            console.log(`└─ Environment: ✅ Production, Preview, Development`);
            console.log('');
        }
    }

    console.log('═'.repeat(70));
    console.log('\n💡 Instructions:');
    console.log('1. Go to: https://vercel.com/dashboard');
    console.log('2. Select your project → Settings → Environment Variables');
    console.log('3. For each variable above, click "Add New"');
    console.log('4. Copy the Key and Value exactly as shown');
    console.log('5. Check all three environments (Production, Preview, Development)');
    console.log('6.Click Save');
    console.log('\nAfter adding all variables, redeploy your project!');
    console.log('═'.repeat(70));

} catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    console.error('\nMake sure you have a .env file in the project root.');
    process.exit(1);
}
