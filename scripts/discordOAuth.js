// Discord OAuth Configuration
const DISCORD_CONFIG = {
    clientId: '1438380414837198980', // Replace with your Discord application client ID
    redirectUri: window.location.origin + '/discord-callback.html',
    scopes: ['identify', 'webhook.incoming'],
    apiEndpoint: 'https://discord.com/api/v10'
};

// Store Discord connection state
let discordConnection = {
    connected: false,
    userId: null,
    username: null,
    webhookUrl: null,
    guildId: null
};

// Initialize Discord connection from localStorage
function initDiscordConnection() {
    const stored = localStorage.getItem('discordConnection');
    if (stored) {
        try {
            discordConnection = JSON.parse(stored);
            updateDiscordUI();
        } catch (e) {
            console.error('Error loading Discord connection:', e);
        }
    }
}

// Save Discord connection to localStorage
function saveDiscordConnection() {
    localStorage.setItem('discordConnection', JSON.stringify(discordConnection));
}

// Start Discord OAuth flow
function connectDiscord() {
    const state = generateRandomState();
    localStorage.setItem('discord_oauth_state', state);
    
    const authUrl = `https://discord.com/api/oauth2/authorize?` +
        `client_id=${DISCORD_CONFIG.clientId}` +
        `&redirect_uri=${encodeURIComponent(DISCORD_CONFIG.redirectUri)}` +
        `&response_type=code` +
        `&scope=${DISCORD_CONFIG.scopes.join('%20')}` +
        `&state=${state}`;
    
    window.location.href = authUrl;
}

// Disconnect Discord
function disconnectDiscord() {
    discordConnection = {
        connected: false,
        userId: null,
        username: null,
        webhookUrl: null,
        guildId: null
    };
    saveDiscordConnection();
    updateDiscordUI();
    showFlyout('Discord disconnected successfully');
}

// Handle OAuth callback
async function handleDiscordCallback(code, state) {
    const savedState = localStorage.getItem('discord_oauth_state');
    
    if (state !== savedState) {
        console.error('State mismatch - possible CSRF attack');
        return false;
    }
    
    try {
        // Exchange code for access token
        const tokenResponse = await fetch(`${DISCORD_CONFIG.apiEndpoint}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: DISCORD_CONFIG.clientId,
                client_secret: 'Y18CEUTMr-Yppqtq3fj3tf2U8ZeuHFM-', // In production, this should be handled server-side
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: DISCORD_CONFIG.redirectUri
            })
        });
        
        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token');
        }
        
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        
        // Get user information
        const userResponse = await fetch(`${DISCORD_CONFIG.apiEndpoint}/users/@me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user information');
        }
        
        const userData = await userResponse.json();
        
        // Store connection info
        discordConnection = {
            connected: true,
            userId: userData.id,
            username: `${userData.username}#${userData.discriminator}`,
            accessToken: accessToken,
            webhookUrl: null,
            guildId: null
        };
        
        saveDiscordConnection();
        localStorage.removeItem('discord_oauth_state');
        
        return true;
    } catch (error) {
        console.error('Error during Discord OAuth:', error);
        return false;
    }
}

// Set webhook URL for posting results
function setDiscordWebhook() {
    const webhookUrl = prompt('Enter your Discord Webhook URL:\n\n' +
        'To create a webhook:\n' +
        '1. Go to Server Settings > Integrations > Webhooks\n' +
        '2. Click "New Webhook"\n' +
        '3. Choose a channel and copy the webhook URL\n' +
        '4. Paste it here');
    
    if (webhookUrl && webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
        discordConnection.webhookUrl = webhookUrl;
        saveDiscordConnection();
        updateDiscordUI();
        showFlyout('Webhook configured successfully!');
        return true;
    } else if (webhookUrl) {
        alert('Invalid webhook URL. Please make sure you copied the entire URL.');
        return false;
    }
    return false;
}

// Sync results to Discord
async function syncResultsToDiscord() {
    if (!discordConnection.connected) {
        alert('Please connect your Discord account first');
        return;
    }
    
    if (!discordConnection.webhookUrl) {
        if (!setDiscordWebhook()) {
            return;
        }
    }
    
    try {
        // Get current results data
        const unit = localStorage.getItem('penisCalcUnit') || 'cm';
        const erectLength = localStorage.getItem('penisCalcErectLength');
        const erectGirth = localStorage.getItem('penisCalcErectGirth');
        const flaccidLength = localStorage.getItem('penisCalcFlaccidLength');
        const flaccidGirth = localStorage.getItem('penisCalcFlaccidGirth');
        
        if (!erectLength || !erectGirth) {
            alert('Please run an analysis first before syncing to Discord');
            return;
        }
        
        // Generate share URL
        const visitorId = generateVisitorId();
        const encodedParams = btoa(`${visitorId}`);
        const shareUrl = `${window.location.origin}/shared-results.html?d=${encodedParams}`;
        
        // Create Discord embed
        const embed = {
            title: '📊 PlsSize.Me Results',
            description: 'New measurement results have been recorded',
            color: 0x5865F2, // Discord blurple
            fields: [
                {
                    name: '📏 Erect Length',
                    value: `${erectLength} ${unit}`,
                    inline: true
                },
                {
                    name: '⭕ Erect Girth',
                    value: `${erectGirth} ${unit}`,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                }
            ],
            footer: {
                text: 'PlsSize.Me - Privacy-first size calculator'
            },
            timestamp: new Date().toISOString()
        };
        
        if (flaccidLength) {
            embed.fields.push({
                name: '📏 Flaccid Length',
                value: `${flaccidLength} ${unit}`,
                inline: true
            });
        }
        
        if (flaccidGirth) {
            embed.fields.push({
                name: '⭕ Flaccid Girth',
                value: `${flaccidGirth} ${unit}`,
                inline: true
            });
        }
        
        // Add share URL
        embed.fields.push({
            name: '🔗 View Full Results',
            value: `[Click here](${shareUrl})`,
            inline: false
        });
        
        // Send to Discord webhook
        const response = await fetch(discordConnection.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'PlsSize.Me',
                embeds: [embed]
            })
        });
        
        if (response.ok || response.status === 204) {
            showFlyout('✅ Results synced to Discord successfully!');
            
            // Update sync count
            const syncCount = parseInt(localStorage.getItem('discordSyncCount') || '0') + 1;
            localStorage.setItem('discordSyncCount', syncCount.toString());
            localStorage.setItem('lastDiscordSync', new Date().toISOString());
            
            updateDiscordUI();
        } else {
            throw new Error(`Discord API returned status ${response.status}`);
        }
    } catch (error) {
        console.error('Error syncing to Discord:', error);
        alert('Failed to sync results to Discord. Please check your webhook URL.');
    }
}

// Update Discord UI elements
function updateDiscordUI() {
    const connectBtn = document.getElementById('discord-connect-btn');
    const syncBtn = document.getElementById('discord-sync-btn');
    const statusDiv = document.getElementById('discord-status');
    
    if (connectBtn && syncBtn && statusDiv) {
        if (discordConnection.connected) {
            connectBtn.textContent = '🔌 Disconnect Discord';
            connectBtn.onclick = disconnectDiscord;
            
            syncBtn.disabled = false;
            syncBtn.style.opacity = '1';
            syncBtn.style.cursor = 'pointer';
            
            const syncCount = localStorage.getItem('discordSyncCount') || '0';
            const lastSync = localStorage.getItem('lastDiscordSync');
            
            let statusText = `✅ Connected as ${discordConnection.username}`;
            if (discordConnection.webhookUrl) {
                statusText += ` | ${syncCount} syncs`;
                if (lastSync) {
                    const date = new Date(lastSync);
                    statusText += ` | Last: ${date.toLocaleString()}`;
                }
            } else {
                statusText += ' | Webhook not configured';
            }
            
            statusDiv.textContent = statusText;
            statusDiv.style.color = '#00d26a';
        } else {
            connectBtn.textContent = '🔗 Connect Discord';
            connectBtn.onclick = connectDiscord;
            
            syncBtn.disabled = true;
            syncBtn.style.opacity = '0.5';
            syncBtn.style.cursor = 'not-allowed';
            
            statusDiv.textContent = '⚠️ Not connected to Discord';
            statusDiv.style.color = '#999';
        }
    }
}

// Generate random state for CSRF protection
function generateRandomState() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Initialize on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initDiscordConnection();
        updateDiscordUI();
    });
}
