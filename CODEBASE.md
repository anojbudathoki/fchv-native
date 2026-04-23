# FCHV Mobile - Project Analysis & Codebase Documentation

This document provides a comprehensive overview of the **FCHV Mobile (FCHV Saathi)** application. It is intended for local reference and should not be committed to the repository.

## 1. Project Overview
- **Name**: FCHV Mobile / FCHV Saathi
- **Purpose**: A health data collection and management application for Female Community Health Volunteers (FCHVs) in Nepal.
- **Organization**: Ministry of Health, Nepal.
- **Target OS**: Android (Primary), iOS.

## 2. Technology Stack
- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Database**: [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (Local persistent storage)
- **Translation**: [i18next](https://www.i18next.com/) with custom `LanguageContext`
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Components**: [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/), [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/)

## 3. Directory Structure (src/)
- **api/**: Contains synchronization logic (`services/sync/sync.ts`) and API configurations.
- **app/**: The core routing directory.
  - **(auth)**: Authentication flow (Login).
  - **dashboard/**: Main application features:
    - `index.tsx`: Main dashboard with statistics and quick actions.
    - `pregnant-list/index.tsx`: List of registered pregnant women.
    - `pregnant-women/index.tsx`: Form for adding/editing pregnancy records.
    - `mother-list.tsx` & `mother-profile.tsx`: Mother management.
    - `household.tsx`: Household data collection.
    - `change-language.tsx`: Language selection interface.
- **assets/**: Images, fonts, and local translation files (`en.json`, `np.json`).
- **components/**:
  - **layout/**: `TopHeader`, `FormHeader`, `NavigationLayout`.
  - **common/**: Reusable UI elements like `InputField`, `PrimaryButton`.
  - **navigation/**: `CustomDrawer`, `BottomNavigation`.
- **context/**: Global state providers (`LanguageContext`, `ToastContext`).
- **hooks/**:
  - **database/**: 
    - `schema.ts`: Defines SQLite tables (`mother`, `pregnancy`, `visit`, `sync`).
    - `models/`: Table-specific logic (`MotherModel`, `PregnantWomenModal`).
  - `usePregnancy`, `useOnlineStatus`: Custom logic hooks.
- **utils/**: Storage and helper utilities.

## 4. Key Data Models & Schema
### Tables
1. **mother**: Primary record for women. Stores personal details, photo, and sync status.
2. **pregnancy**: Linked to `mother_id`. Tracks LMP, EDD, Gravida, Parity, and whether the pregnancy is current.
3. **visit**: Tracks health post or home visits.
4. **sync**: Tracks the last successfully synchronized timestamp for each table.

## 5. Main Workflows
- **Onboarding**: Login via Health Worker ID.
- **Registration**: Registering a mother -> Adding a pregnancy record.
- **Dashboard**: High-level view of community health stats (Pregnant count, Mother count).
- **Synchronization**: Automatic sync triggered on the dashboard when network is detected (`useOnlineStatus` -> `doSync`).
- **Localization**: Supports English and Nepali, persisting choice via local storage.

## 6. Design Principles
- **Modern UI**: Uses rounded corners (`rounded-3xl`), soft shadows, and a clean blue/white palette.
- **Accessibility**: Includes Nepali translations and high-contrast text for community use.
- **Offline First**: All data is saved to SQLite first and synced to the cloud when online.

---
*Created on: 2026-04-20*
*Note: Add this file to .gitignore to keep it local only.*
