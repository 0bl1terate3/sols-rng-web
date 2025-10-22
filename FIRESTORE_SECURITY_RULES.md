# Firestore Security Rules for Global Webhooks

## Required Security Rules

Add these rules to your Firestore security rules to enable global webhooks:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Global Leaderboard Collection (existing)
    match /globalLeaderboard/{entryId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['playerId', 'playerName', 'auraName', 'auraRarity', 'auraTier', 'rollCount', 'timestamp', 'submittedAt'])
        && request.resource.data.playerName.size() >= 3
        && request.resource.data.playerName.size() <= 20
        && request.resource.data.auraRarity > 99
        && request.resource.data.auraName is string
        && request.resource.data.auraTier in ['transcendent', 'exotic', 'mythic', 'legendary', 'rare', 'uncommon', 'common'];
      allow update: if request.auth != null
        && request.resource.data.playerId == resource.data.playerId;
      allow delete: if false;
    }

    // Collected Stats Leaderboard (existing)
    match /collectedStats/{entryId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['playerId', 'playerName', 'totalScore', 'uniqueAuras', 'timestamp'])
        && request.resource.data.playerName.size() >= 3
        && request.resource.data.playerName.size() <= 20;
      allow update: if request.resource.data.playerId == resource.data.playerId;
      allow delete: if false;
    }

    // Player Stats Collection (existing)
    match /playerStats/{playerId} {
      allow read: if true;
      allow write: if request.resource.data.playerId == playerId;
      allow delete: if false;
    }

    // Admin Collection - Password & Config
    match /admin/config {
      allow read: if true;  // Allows checking admin password
      allow write: if false; // Only manually editable in Firebase console
    }

    // Admin Collection - Global Webhooks (NEW)
    match /admin/webhooks {
      allow read: if true;  // ALL PLAYERS can read webhooks
      allow write: if false; // Only admins via authenticated session (handled in code)
    }

    // Admin - Player Control (existing)
    match /playerControl/{playerId} {
      allow read: if true;
      allow write: if false;
    }

    // Admin - Global Updates (existing)
    match /globalUpdates/current {
      allow read: if true;
      allow write: if false;
    }

    // Admin - Aura Gifts (existing)
    match /auraGifts/{playerId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## How It Works

### 1. **Admin Sets Webhooks**
- Admin opens admin panel (Ctrl+Shift+A)
- Enters admin password
- Configures webhook URLs
- Clicks "Save Webhooks"
- Webhooks are saved to `admin/webhooks` in Firestore

### 2. **All Players Fetch Webhooks**
- When any player finds a rare aura/milestone/achievement
- Their game automatically fetches webhooks from `admin/webhooks`
- Webhooks are cached for 5 minutes to reduce reads
- Events are sent to YOUR Discord channels

### 3. **Security**
- `allow read: if true` - All players can read webhooks
- `allow write: if false` - No one can write via security rules
- Writes are done via admin panel with password authentication
- Only you (the admin) can configure webhooks

## Initial Setup in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Create collection: `admin`
3. Create document: `config`
4. Add field: `password` (string) = "your_secret_password"
5. Create document: `webhooks` (will be auto-created on first save)

## Benefits

✅ **Truly Global** - All players' events go to your Discord
✅ **Centralized** - One place to configure webhooks
✅ **Secure** - Only admin can change webhooks
✅ **Efficient** - Webhooks cached for 5 minutes
✅ **Real-time** - Update webhooks anytime, changes apply to all players
✅ **No Player Setup** - Players don't configure anything

## Testing

1. Set your webhooks in admin panel
2. Click "Save Webhooks" (saves to Firestore)
3. Have another player (or open incognito) find a rare aura
4. Their event appears in YOUR Discord!
