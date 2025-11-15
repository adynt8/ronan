# Discord OAuth Integration - Quick Start Guide

## 📦 What's Been Added

Discord OAuth integration that allows users to sync their PlsSize.Me measurement results directly to their Discord servers via webhooks.

### New Files Created

1. **`scripts/discordOAuth.js`** - Main Discord integration logic
2. **`discord-callback.html`** - OAuth callback handler page
3. **`discord-setup.html`** - Complete user setup guide with step-by-step instructions
4. **`discord-preview.html`** - Preview of Discord message appearance
5. **`discord-config-template.js`** - Configuration template with instructions
6. **`DISCORD_INTEGRATION.md`** - Technical documentation
7. **`DISCORD_README.md`** - This file

### Modified Files

1. **`index.html`** 
   - Added Discord Integration section with UI controls
   - Added script reference to discordOAuth.js
   - Added link to setup guide in footer

2. **`scripts/shareResults.js`**
   - Added Discord as a share option in the modal

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- Discord account
- Discord server where you have admin permissions
- Your website must use HTTPS (required by Discord)

### Step 1: Create Discord Application
```
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "PlsSize.Me" (or anything you prefer)
4. Note your Client ID from the OAuth2 section
5. Generate and copy your Client Secret
```

### Step 2: Configure Redirect URI
```
In Discord Developer Portal → OAuth2 → Redirects:
Add: https://yourdomain.com/discord-callback.html
Replace 'yourdomain.com' with your actual domain
Click "Save Changes"
```

### Step 3: Update Configuration
```javascript
// Edit scripts/discordOAuth.js

// Line 3: Replace this
clientId: 'YOUR_DISCORD_CLIENT_ID'
// With your actual Client ID
clientId: '1234567890123456789'

// Line 93: Replace this
client_secret: 'YOUR_DISCORD_CLIENT_SECRET'
// With your actual Client Secret
client_secret: 'your_actual_secret_here'
```

### Step 4: Create Webhook
```
1. Open your Discord server
2. Server Settings → Integrations → Webhooks
3. Click "New Webhook"
4. Choose a channel and copy the webhook URL
5. Save changes
```

### Step 5: Test It!
```
1. Open your website
2. Scroll to "Discord Integration" section
3. Click "Connect Discord"
4. Authorize the application
5. Paste your webhook URL when prompted
6. Run a calculation
7. Click "Sync Results to Discord"
8. Check your Discord channel!
```

## 🎨 Features

### For Users
- ✅ One-click Discord connection via OAuth2
- ✅ Secure webhook configuration
- ✅ Rich formatted messages with measurement data
- ✅ Automatic share links included
- ✅ Sync history tracking
- ✅ Easy disconnect option
- ✅ Privacy-focused (user controls everything)

### For Developers
- ✅ Complete OAuth2 flow implementation
- ✅ LocalStorage-based state management
- ✅ Error handling and validation
- ✅ CSRF protection with state parameter
- ✅ Clean UI integration
- ✅ Comprehensive documentation

## 🖼️ User Interface

### Main Page Integration
New section added to index.html:
```
🎮 Discord Integration
├── Connection Status Display
├── "Connect Discord" Button
├── "Sync Results to Discord" Button
├── "Configure Webhook" Button
└── Link to Setup Guide
```

### Share Modal
Discord added as share option:
```
Share Your Results
├── 🔗 Copy Link
├── 🎮 Discord (NEW!)
├── 🐦 Twitter
└── 🔴 Reddit
```

## 📊 What Gets Posted to Discord

Each sync creates a rich embed with:
- 📏 Erect Length
- ⭕ Erect Girth
- 📏 Flaccid Length (if provided)
- ⭕ Flaccid Girth (if provided)
- 🔗 Link to full results page
- ⏰ Timestamp
- 🎨 Discord blurple theme (#5865F2)

See `discord-preview.html` for visual examples.

## 🔒 Security & Privacy

### Current Implementation
⚠️ **Development Setup**: Client secret is in client-side code

### Production Recommendations
For production use, you MUST implement:
1. Backend server for OAuth token exchange
2. Environment variables for secrets
3. Server-side webhook posting
4. Rate limiting
5. Session management

See `DISCORD_INTEGRATION.md` for detailed security guidance.

### Privacy Features
- User chooses which channel receives posts
- All data stored locally (localStorage)
- No third-party servers involved
- Easy disconnect and data deletion
- Webhook URLs never exposed publicly

## 🛠️ Configuration Files

### `discord-config-template.js`
Copy this file and fill in your credentials:
```javascript
const DISCORD_CLIENT_ID = 'your_client_id';
const DISCORD_CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'https://yourdomain.com/discord-callback.html';
```

**Important**: Don't commit this file with real credentials!

## 📖 Documentation

### For Users
- **`discord-setup.html`** - Complete setup guide with screenshots
- **`discord-preview.html`** - See what Discord posts look like

### For Developers
- **`DISCORD_INTEGRATION.md`** - Technical documentation
- **`discord-config-template.js`** - Configuration instructions
- **`scripts/discordOAuth.js`** - Inline code comments

## 🧪 Testing Checklist

- [ ] Discord application created
- [ ] Client ID and Secret configured
- [ ] Redirect URI added to Discord
- [ ] Webhook created in Discord server
- [ ] "Connect Discord" button works
- [ ] OAuth flow completes successfully
- [ ] Webhook configuration accepts valid URL
- [ ] Sync button becomes enabled after connection
- [ ] Results post to Discord correctly
- [ ] Embed formatting looks correct
- [ ] Share link works
- [ ] Disconnect clears all data
- [ ] UI updates correctly

## ❓ Common Issues

### "redirect_uri_mismatch"
- Ensure redirect URI in Discord matches exactly
- Check for trailing slashes
- Verify HTTPS vs HTTP

### "Invalid client"
- Double-check Client ID and Secret
- Ensure no extra spaces
- Verify you're using the correct application

### Webhook fails
- Verify webhook URL format
- Check webhook exists in Discord
- Ensure channel permissions are correct

### No results to sync
- Run a calculation first
- Check localStorage has measurement data

## 🎯 Usage Flow

```
User visits site
    ↓
Runs calculation
    ↓
Clicks "Connect Discord"
    ↓
Redirected to Discord OAuth
    ↓
User authorizes
    ↓
Redirected back to site
    ↓
Prompted for webhook URL
    ↓
User pastes webhook
    ↓
Clicks "Sync Results"
    ↓
Results posted to Discord
    ↓
Success notification shown
```

## 📈 Future Enhancements

Potential improvements:
- Automatic sync on calculation
- Multiple webhook support
- Server-side OAuth handling
- Discord bot for channel selection
- Sync history viewer
- Scheduled posting
- Custom embed colors
- Webhook health monitoring

## 🤝 Support

### Help Resources
1. View `discord-setup.html` for detailed setup instructions
2. Check `discord-preview.html` to see expected output
3. Read `DISCORD_INTEGRATION.md` for technical details
4. Review Discord's [OAuth2 docs](https://discord.com/developers/docs/topics/oauth2)
5. Check browser console for error messages

### Troubleshooting
1. Verify all configuration steps completed
2. Check browser console for errors
3. Test with a simple webhook first
4. Ensure HTTPS is enabled
5. Clear browser cache if needed

## 📝 License

Same as main project license.

## ✅ Installation Checklist

Quick reference for setup:

- [ ] Created Discord application
- [ ] Noted Client ID
- [ ] Generated Client Secret
- [ ] Added redirect URI to Discord
- [ ] Updated `scripts/discordOAuth.js` with Client ID
- [ ] Updated `scripts/discordOAuth.js` with Client Secret
- [ ] Created webhook in Discord server
- [ ] Tested OAuth connection
- [ ] Tested webhook posting
- [ ] Reviewed security considerations
- [ ] Planned production server setup

---

**Ready to Go?** Open `discord-setup.html` in your browser for the complete visual guide!
