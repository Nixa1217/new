# Mind Frame Mobile

A React Native mobile app for personal development and wellness, powered by Supabase and Gemini AI.

## Features

- **Authentication**: Secure email/password auth via Supabase
- **Daily Journaling**: Guided reflection with AI prompts
- **Vision Board**: Track and visualize your goals
- **Identity Portal**: Explore and define your core identities
- **Vault**: Powerful transformation tools
- **Gemini AI Integration**: AI-powered insights and guidance
- **Cross-platform**: iOS and Android support

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd mind-frame-mobile
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your Supabase and Gemini API credentials in `.env`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

4. Install iOS dependencies (macOS only)
```bash
cd ios && pod install && cd ..
```

### Running the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Project Structure

```
src/
├── navigation/          # Navigation setup and stacks
├── screens/             # Screen components
│   ├── auth/           # Authentication screens
│   └── [feature]/      # Feature screens
├── components/          # Reusable UI components
├── services/           # API and service integrations
│   ├── supabase.ts     # Supabase client and types
│   ├── auth.ts         # Auth service
│   └── gemini.ts       # Gemini AI service
├── store/              # Zustand state management
└── App.tsx             # Root component
```

## Key Services

### Supabase
- Authentication
- Data persistence
- Real-time syncing
- Row-level security

### Gemini API
- AI-powered insights
- Content generation
- Affirmation generation
- Smart responses

## Data Models

### Core Tables
- `user_profile` - User preferences and profile
- `daily_reflection` - Daily entries
- `weekly_reflection` - Weekly recalibrations
- `morning_reflection` - Morning intentions
- `identity_rep` - Core identity representations
- `vision_board` - Vision board items
- `journal_entry` - Journal entries
- `goal_action_session` - Goal action sequences
- `seven_layers_session` - Deep exploration sessions
- `alchemist_forge_session` - Challenge transmutation
- `flow_command_session` - Flow state sessions

## Development

### Adding New Screens

1. Create a new file in `src/screens/`
2. Add route to `RootNavigator.tsx`
3. Import and register the screen

### Adding New Components

1. Create component in `src/components/`
2. Export from component index
3. Import where needed

### State Management

Using Zustand for state management:
- `authStore` - User authentication state
- `profileStore` - User profile data

Add new stores in `src/store/`

## Styling

Using React Native StyleSheet with a consistent color scheme:
- Primary: `#D4AF77` (Gold)
- Background: `#F5EFE7` (Cream)
- Text: `#5C4A3A` (Deep Brown)
- Accent: `#E8D5C4` (Soft Blush)

## API Integration

### Supabase
```typescript
import { supabase } from './services/supabase';

// Fetch data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', userId);
```

### Gemini AI
```typescript
import { geminiService } from './services/gemini';

// Generate content
const text = await geminiService.generateText('Your prompt');
```

## Database Migrations

Migrations are tracked in Supabase. New schema changes should be created as migrations through the Supabase dashboard or CLI.

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Pod install errors (iOS)
```bash
cd ios && rm -rf Pods && pod install && cd ..
```

### Supabase connection
Verify your environment variables are correctly set and your Supabase project is active.

## Contributing

Follow the existing code patterns and style. Ensure new code is tested before submitting.

## License

MIT
