# Discord OAuth Integration

This document explains how to set up and use the Discord OAuth integration for PlsSize.Me, allowing users to sync their measurement results directly to their Discord servers.

## Features

- **OAuth2 Authentication**: Secure Discord account connection
- **Webhook Integration**: Post results directly to Discord channels
- **Rich Embeds**: Beautiful formatted messages with measurement data
- **Share Links**: Each sync includes a shareable URL
- **Sync History**: Track syncing activity and timestamps
- **Privacy-Focused**: User controls where data is posted

## Quick Start

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it (e.g., "PlsSize.Me")
3. Navigate to OAuth2 section
4. Copy your Client ID
5. Generate and copy your Client Secret

### 2. Configure OAuth2 Redirect

In the OAuth2 settings:
1. Add redirect URL: `https://yourdomain.com/discord-callback.html`
2. Replace `yourdomain.com` with your actual domain
3. Save changes

### 3. Update Configuration

Edit `scripts/discordOAuth.js`:

```javascript
const DISCORD_CONFIG = {
    clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE',
    // ... rest of config
};
```

**IMPORTANT**: In the `handleDiscordCallback` function, replace `YOUR_DISCORD_CLIENT_SECRET` with your actual client secret.

### 4. Create a Webhook

In your Discord server:
1. Server Settings → Integrations → Webhooks
2. Create New Webhook
3. Choose a channel and copy the webhook URL
4. Users will paste this URL when connecting

## Architecture

### Files

- `scripts/discordOAuth.js` - Main Discord integration logic
- `discord-callback.html` - OAuth callback handler page
- `discord-setup.html` - User setup guide
- `DISCORD_INTEGRATION.md` - This documentation

### OAuth Flow

1. User clicks "Connect Discord"
2. Redirected to Discord authorization
3. User approves application
4. Discord redirects back to `discord-callback.html` with code
5. Exchange code for access token
6. Fetch user information
7. Store connection in localStorage
8. Redirect back to main site

### Webhook Posting

1. User configures webhook URL
2. When syncing results:
   - Gather measurement data from localStorage
   - Format as Discord embed
   - POST to webhook URL
   - Update sync statistics

## Security Considerations

### ⚠️ Production Warning

The current implementation includes the client secret in client-side code, which is **NOT SECURE** for production use.

### Recommended Production Setup

1. **Backend Server**: Create a server-side endpoint to handle OAuth
2. **Environment Variables**: Store secrets server-side
3. **Token Exchange**: Server exchanges code for token
4. **API Proxy**: Server posts to Discord on behalf of user

Example flow:
```
Client → Your Server → Discord API
       ← Your Server ← Discord API
```

### Best Practices

- Use HTTPS everywhere (required by Discord)
- Rotate webhook URLs regularly
- Use private Discord channels for sensitive data
- Implement rate limiting
- Validate all user inputs
- Don't log sensitive data

## API Reference

### `connectDiscord()`
Initiates Discord OAuth flow.

### `disconnectDiscord()`
Clears Discord connection and localStorage.

### `setDiscordWebhook()`
Prompts user to configure webhook URL.

### `syncResultsToDiscord()`
Posts current results to configured webhook.

### `updateDiscordUI()`
Updates UI elements based on connection state.

## Discord Embed Format

Results are posted as rich embeds:

```javascript
{
    title: '📊 PlsSize.Me Results',
    description: 'New measurement results have been recorded',
    color: 0x5865F2, // Discord blurple
    fields: [
        { name: '📏 Erect Length', value: '15.2 cm', inline: true },
        { name: '⭕ Erect Girth', value: '12.0 cm', inline: true },
        // ... more fields
        { name: '🔗 View Full Results', value: '[Click here](url)' }
    ],
    footer: { text: 'PlsSize.Me - Privacy-first size calculator' },
    timestamp: new Date().toISOString()
}
```

## localStorage Schema

```javascript
{
    discordConnection: {
        connected: boolean,
        userId: string,
        username: string,
        webhookUrl: string,
        guildId: string,
        accessToken: string // Session only
    },
    discordSyncCount: number,
    lastDiscordSync: ISO8601 timestamp
}
```

## Troubleshooting

### Connection Fails
- Verify Client ID is correct
- Check redirect URI matches exactly
- Ensure using HTTPS
- Clear browser cache

### Webhook Not Working
- Verify webhook URL format: `https://discord.com/api/webhooks/...`
- Check webhook exists in Discord
- Ensure calculations are run first
- Check browser console for errors

### Authorization Errors
- Verify scopes are correct
- Check application is not disabled
- Ensure user has server permissions
- Try disconnecting and reconnecting

## Limitations

- Webhook URLs must be manually configured
- No automatic channel selection
- Rate limits apply (30 requests per minute per webhook)
- Embeds limited to 25 fields, 6000 total characters
- Requires JavaScript enabled

## Future Enhancements

Potential improvements:

- [ ] Server-side OAuth handling
- [ ] Automatic webhook creation via bot
- [ ] Channel selection UI
- [ ] Multiple webhook support
- [ ] Sync history viewer
- [ ] Automatic sync on calculation
- [ ] Discord bot commands
- [ ] Scheduled syncing
- [ ] Webhook health monitoring

## Support

For issues or questions:
1. Check the setup guide at `/discord-setup.html`
2. Review Discord's [OAuth2 documentation](https://discord.com/developers/docs/topics/oauth2)
3. Check browser console for errors
4. Verify all configuration steps

## License

Same as main project license.

## Changelog

### v1.0.0 (2024)
- Initial Discord OAuth integration
- Webhook posting support
- Rich embed formatting
- Setup documentation
- UI integration
