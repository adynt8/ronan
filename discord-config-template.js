/**
 * Discord OAuth Configuration Template
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://discord.com/developers/applications
 * 2. Create a new application or select existing one
 * 3. Copy your Client ID from the OAuth2 section
 * 4. Generate and copy your Client Secret (keep this PRIVATE!)
 * 5. Add redirect URI: https://yourdomain.com/discord-callback.html
 * 6. Fill in the values below
 * 7. Copy the relevant sections to scripts/discordOAuth.js
 */

// STEP 1: Replace these values with your Discord application credentials
const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID_HERE';
const DISCORD_CLIENT_SECRET = 'YOUR_DISCORD_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'https://yourdomain.com/discord-callback.html'; // Change to your domain

// STEP 2: Update the DISCORD_CONFIG in scripts/discordOAuth.js
// Replace the clientId value (line 3) with your DISCORD_CLIENT_ID

// STEP 3: Update the handleDiscordCallback function in scripts/discordOAuth.js
// Replace 'YOUR_DISCORD_CLIENT_SECRET' (line 93) with your DISCORD_CLIENT_SECRET

// STEP 4: Update the redirectUri in scripts/discordOAuth.js (line 4)
// Replace with your actual domain

/**
 * SECURITY WARNING:
 * 
 * This is a DEVELOPMENT SETUP ONLY!
 * 
 * For production, you MUST implement a backend server to handle OAuth securely.
 * NEVER expose your client secret in client-side code!
 * 
 * Production setup should:
 * 1. Handle OAuth token exchange server-side
 * 2. Store secrets in environment variables
 * 3. Use secure session management
 * 4. Implement rate limiting
 * 5. Use HTTPS everywhere
 * 
 * See DISCORD_INTEGRATION.md for more details.
 */

// Example production server endpoint structure:
/*
POST /api/discord/connect
{
    "code": "authorization_code_from_discord"
}

Response:
{
    "success": true,
    "userId": "discord_user_id",
    "username": "username#1234"
}
*/

/**
 * Testing Your Setup:
 * 
 * 1. Update all configuration values above
 * 2. Copy changes to scripts/discordOAuth.js
 * 3. Open index.html in a browser
 * 4. Scroll to Discord Integration section
 * 5. Click "Connect Discord"
 * 6. Authorize the application
 * 7. You should be redirected back to index.html
 * 8. Status should show "Connected as yourusername"
 * 9. Click "Configure Webhook" and paste your webhook URL
 * 10. Run a calculation
 * 11. Click "Sync Results to Discord"
 * 12. Check your Discord channel for the message!
 */

/**
 * Creating a Webhook:
 * 
 * 1. Open your Discord server
 * 2. Go to Server Settings (click server name → Server Settings)
 * 3. Click "Integrations" in the left sidebar
 * 4. Click "Webhooks"
 * 5. Click "New Webhook"
 * 6. Give it a name (e.g., "PlsSize.Me Bot")
 * 7. Choose the channel where results should be posted
 * 8. Click "Copy Webhook URL"
 * 9. Save changes
 * 10. Paste the URL when prompted in PlsSize.Me
 * 
 * Webhook URL format:
 * https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
 */

/**
 * Troubleshooting:
 * 
 * Q: Connection fails with "redirect_uri_mismatch"
 * A: Make sure the redirect URI in Discord Developer Portal matches exactly
 * 
 * Q: Nothing happens when clicking "Connect Discord"
 * A: Check browser console for errors, verify CLIENT_ID is set correctly
 * 
 * Q: Webhook posting fails
 * A: Verify webhook URL is correct and webhook exists in Discord
 * 
 * Q: "Invalid client" error
 * A: Check that CLIENT_SECRET is correct in handleDiscordCallback function
 * 
 * Q: Page doesn't redirect after authorization
 * A: Ensure discord-callback.html exists and is accessible
 */

// DO NOT COMMIT THIS FILE WITH REAL CREDENTIALS!
// Add to .gitignore if using version control
