# Mind Frame Mobile - Setup Guide

## Quick Start

### Step 1: Environment Setup

Your Supabase database has been created with the following tables:
- `user_profile`
- `daily_reflection`
- `weekly_reflection`
- `morning_reflection`
- `identity_rep`
- `vision_board`
- `embodiment_mirror`
- `goal_action_session`
- `seven_layers_session`
- `journal_entry`
- `alchemist_forge_session`
- `flow_command_session`

All tables have Row Level Security (RLS) enabled and are connected to the auth.users table.

### Step 2: Configure Environment Variables

1. Update your `.env` file with:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-google-gemini-api-key
```

Get these from:
- **Supabase**: Dashboard > Project Settings > API
- **Gemini API**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### Step 5: Run the App

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

## Architecture Overview

### Authentication Flow
1. User signs up/in via Supabase Auth
2. Zustand store (`authStore`) manages user session
3. JWT token automatically included in all requests
4. RLS policies ensure users can only access their own data

### Data Flow
1. Services layer (`services/supabase.ts`, `services/gemini.ts`) handles API calls
2. Zustand stores manage state (`store/authStore.ts`, `store/profileStore.ts`)
3. Screens consume data from stores and display UI
4. React Navigation handles screen transitions

### AI Integration
The Gemini service provides:
- `generateText()` - General text generation
- `generateActions()` - Goal-to-actions conversion
- `generateReflection()` - Guided reflection prompts
- `generateInsights()` - Content analysis
- `generateAffirmations()` - Custom affirmations
- `chatWithAI()` - Conversational AI

## Key Features Implemented

### Authentication
- Sign up with email/password
- Sign in with email/password
- Sign out
- Session persistence

### Compass (Home)
- User welcome with personalized name
- Quick access to rituals
- Progress tracking (daily, weekly, morning)
- Settings button

### Daily Journal
- Write entries with guided prompts
- Save entries to database
- View past entries
- Automatic date tracking

### Vision Board
- Create vision items
- Categorize goals
- Delete items
- View all items

### Identity Portal
- Define core identities
- Track identity levels
- Add descriptions

### Frequencies & Vault
- Browse meditation frequencies
- Access transformation tools (placeholders for expansion)

### Profile/Settings
- Update preferred name
- Edit identity summary
- Edit life purpose
- View subscription tier
- Sign out

## Customization Guide

### Adding New Screens

1. Create screen in `src/screens/YourScreen.tsx`:
```typescript
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function YourScreen() {
  return (
    <SafeAreaView>
      <Text>Your screen</Text>
    </SafeAreaView>
  );
}
```

2. Add to navigation in `src/navigation/RootNavigator.tsx`

### Using Supabase in Screens

```typescript
import { supabase } from '../services/supabase';

// Fetch data
const { data } = await supabase
  .from('daily_reflection')
  .select('*')
  .eq('user_id', user.id);

// Insert data
await supabase.from('journal_entry').insert({
  user_id: user.id,
  date: new Date().toISOString().split('T')[0],
  content: 'My entry',
});

// Update data
await supabase
  .from('user_profile')
  .update({ preferred_name: 'New Name' })
  .eq('id', profileId);
```

### Using Gemini for AI Features

```typescript
import { geminiService } from '../services/gemini';

// Generate actions from a goal
const actions = await geminiService.generateActions(
  'Build a successful business',
  'Visionary entrepreneur',
  'Excited and determined'
);

// Get affirmations
const affirmations = await geminiService.generateAffirmations(
  'Bold creative',
  'Express authentic self'
);
```

## Styling

All screens use the consistent color scheme:
- **Primary Gold**: `#D4AF77`
- **Cream Background**: `#F5EFE7`
- **Deep Brown Text**: `#5C4A3A`
- **Soft Blush Accent**: `#E8D5C4`

Modify color values in individual StyleSheets or create a theme file.

## Database Migrations

If you need to modify the schema:

1. Go to Supabase Dashboard > SQL Editor
2. Create new migration
3. Apply and verify in app

Or use the migration tool:
```typescript
import { mcp__supabase__apply_migration } from '@supabase/functions';
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm start -- --reset-cache
```

### Supabase connection fails
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check internet connection
- Ensure Supabase project is running

### Gemini API errors
- Verify `VITE_GEMINI_API_KEY` is valid
- Check Google AI Studio for API quota/limits
- Ensure API is enabled

### iOS build fails
```bash
cd ios && rm -rf Pods && pod install && cd ..
npm run ios
```

### Android build fails
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

## Next Steps

1. **Customize colors** in component StyleSheets
2. **Add morning/evening rituals** screens
3. **Implement vault tools** with full Gemini integration
4. **Add image uploads** for vision board
5. **Create notifications** for daily reminders
6. **Add offline support** with local storage
7. **Implement analytics** to track user engagement

## Support

For issues:
1. Check the troubleshooting section
2. Review Supabase docs: https://supabase.com/docs
3. Check Gemini API docs: https://ai.google.dev/docs
4. React Native docs: https://reactnative.dev/docs
