# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Roteirize is a mobile travel planning app built with React Native and Expo. Users can create personalized travel itineraries based on their interests, budget, and travel style.

## Development Commands

```bash
npm start          # Start Expo development server
npm run android    # Start on Android
npm run ios        # Start on iOS
npm run web        # Start on web
npm run lint       # Run ESLint
```

## Architecture

### Routing
Uses **Expo Router** with file-based routing in `app/`. All routes use `<Stack>` navigation with hidden headers (configured in `_layout.tsx`).

Key route patterns:
- Dynamic routes: `app/place/[slug].tsx`, `app/itineraries/[id].tsx`
- Tab-like navigation managed manually in home screen via `TAB_ROUTES`

### State Management
- **OnboardingContext** (`context/OnboardingContext.tsx`): Manages user onboarding preferences (interests, budget, pace, days) using React Context. Wraps the entire app.
- No external state library; uses local state + context

### Theming
Centralized colors in `theme/colors.ts`. Import as:
```typescript
import { colors } from '../theme/colors';
```
Primary brand color: `#2CBFAE` (teal)

### Type System
- TypeScript with strict mode enabled
- Path alias `@/*` maps to project root
- Core types in `types/` (e.g., `Itinerary.ts` defines itinerary data structures)

### Components
Reusable components in `components/`:
- `Button.tsx`: Primary button, supports both `href` (Link) and `onPress` modes
- `Input.tsx`: Form input component
- `Footer.tsx`: Bottom navigation bar with animated icons (home, search, map, profile)

### Data Layer
Currently uses mock data in `data/mockItineraries.ts`. The `Itinerary` type includes daily plans, restaurants, and checklist items.

## Code Conventions

- Prettier config: single quotes, trailing commas, 80 char width
- Portuguese language for user-facing strings
- Screen components export default functions, helper components are non-exported functions within the same file
