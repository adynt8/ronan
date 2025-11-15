# Discord Integration - Quick Start

## 🚀 5-Minute Setup

### Step 1: Discord Developer Portal
```
1. Visit: https://discord.com/developers/applications
2. Click "New Application"
3. Note your Client ID
4. Generate Client Secret
5. Add redirect: https://yourdomain.com/discord-callback.html
```

### Step 2: Update Code
```javascript
// Edit: scripts/discordOAuth.js

// Line 3:
clientId: 'YOUR_CLIENT_ID_HERE'

// Line 93:
client_secret: 'YOUR_CLIENT_SECRET_HERE'
```

### Step 3: Create Webhook
```
1. Discord Server Settings
2. Integrations → Webhooks
3. New Webhook
4. Copy URL
```

### Step 4: Test
```
1. Open: test-discord-webhook.html
2. Paste webhook URL
3. Click "Send Test Message"
4. ✅ Verify in Discord
```

### Step 5: Use It!
```
1. Main page → "Connect Discord"
2. Authorize
3. "Configure Webhook" → Paste URL
4. Run calculation
5. "Sync Results to Discord"
6. 🎉 Done!
```

## 📚 Documentation Map

| Need | File |
|------|------|
| Visual setup guide | `discord-setup.html` |
| See examples | `discord-preview.html` |
| Test webhook | `test-discord-webhook.html` |
| Technical docs | `DISCORD_INTEGRATION.md` |
| Quick reference | `DISCORD_README.md` |
| Setup checklist | `SETUP_CHECKLIST.md` |
| Config help | `discord-config-template.js` |

## ⚡ Features

✅ OAuth2 connection  
✅ Webhook posting  
✅ Rich embeds  
✅ Share links  
✅ Sync history  
✅ Easy disconnect  

## ⚠️ Important

**SECURITY**: Client secret in client code = development only!  
**PRODUCTION**: Use backend server for OAuth flow

## 🆘 Problems?

| Issue | Solution |
|-------|----------|
| Can't connect | Check Client ID & redirect URI |
| Webhook fails | Verify URL format & existence |
| No message | Run calculation first |
| CORS error | Normal for webhooks, message still sent |

## 🔗 Quick Links

- [Discord Developers](https://discord.com/developers/applications)
- [OAuth2 Docs](https://discord.com/developers/docs/topics/oauth2)
- [Webhook Docs](https://discord.com/developers/docs/resources/webhook)

---

**Need more help?** Open `discord-setup.html` in your browser!
